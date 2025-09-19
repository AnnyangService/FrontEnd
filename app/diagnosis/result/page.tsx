"use client"

/*
URL로 넘어온 정보들 일단 보여주고(step1)
step2로딩, 로딩 끝나면 보여줌
무조건 step3이동하도록

*/

"use client"

import { Suspense, useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Image from "next/image"
import { useDiagnosis } from "@/hooks/use-diagnosis"
import type { DiagnosisResponse, DiagnosisStep2Response } from "@/api/diagnosis/diagnosis.types"
import { Loader2 } from "lucide-react"

// 이 페이지에서 표시할 전체 진단 결과의 상태 타입
interface CombinedDiagnosisResult {
  step1Result: DiagnosisResponse | null;
  step2Result: DiagnosisStep2Response | null;
  previewImageUrl: string | null;
  currentAnalysisText: string;
  statusText: string;
}

function DiagnosisResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // loadingStep2와 errorStep2는 useDiagnosis 훅에서 가져오지만, 실제 UI 표시는 step2Polling과 pageError 상태를 사용합니다.
  const { getDiseaseCategory, errorStep2 } = useDiagnosis()

  const idParam = searchParams.get('id')
  const isNormalParam = searchParams.get('isNormal')
  const imageUrlParam = searchParams.get('imageUrl')
  const confidenceParam = searchParams.get('confidence')

  const [combinedResult, setCombinedResult] = useState<CombinedDiagnosisResult | null>(null)
  const [isLoadingPage, setIsLoadingPage] = useState(true)
  const [showDetailedDiagnosisButton, setShowDetailedDiagnosisButton] = useState(false);

  const renderAnalysisText = (text: string) => {
    // 텍스트를 "***" 기준으로 분리하되, 감싸는 부분도 유지합니다.
    const parts = text.split(/(\*\*\*.*?\*\*\*)/g).filter(Boolean);

    return parts.map((part, index) => {
      // "***"로 시작하고 끝나는 부분은 <strong> 태그로 감싸줍니다.
      if (part.startsWith('***') && part.endsWith('***')) {
        return <strong key={index}>{part.slice(3, -3)}</strong>;
      }
      // 나머지는 그대로 텍스트로 반환합니다.
      return part;
    });
  };


  // processStep2Result 함수에서 showChatButton 관련 로직 제거
  const processStep2Result = useCallback((step1Analysis: string, step2Data: DiagnosisStep2Response | null, step2ErrorText?: string | null) => {
    let analysisText = step1Analysis;
    

    

    if (step2Data) {
      const categoryConfidencePercentage = (step2Data.confidence * 100).toFixed(2);

      if(step2Data.category == "corneal")
        analysisText += `\n\n각막 관련 질병이 의심됩니다. (신뢰도: ${categoryConfidencePercentage}%)`;
      else
      analysisText += `\n\n염증 관련 질병이 의심됩니다. (신뢰도: ${categoryConfidencePercentage}%)`;
    } else if (step2ErrorText) {
      analysisText += `\n\n질병 카테고리 분석 중 오류 발생: ${step2ErrorText}`;
    } else {
      analysisText += `\n\n질병 카테고리 분석 진행 중...`;
    }
    return { analysisText };
  }, []);

  const MAX_POLLING_ATTEMPTS = 20;
  const POLLING_INTERVAL = 3000;
  
  const pollingStatusRef = useRef({
    isPolling: false,
    attempts: 0,
    intervalId: null as NodeJS.Timeout | null
  });
  
  const [step2Polling, setStep2Polling] = useState(false); // Step 2 폴링 로딩 상태

  const pollStep2Data = useCallback(async (diagnosisId: string, baseAnalysisText: string, step1IsNormal: boolean) => {
    if (pollingStatusRef.current.isPolling) return;
    
    pollingStatusRef.current.isPolling = true;
    pollingStatusRef.current.attempts = 0;
    setStep2Polling(true); // 폴링 시작 시 로딩 상태 true
    
    const pollStep2Results = async () => {
      pollingStatusRef.current.attempts += 1;
      console.log(`🔄 Step2 데이터 폴링 시도 #${pollingStatusRef.current.attempts}`);
      
      try {
        const step2Data = await getDiseaseCategory(diagnosisId);
        
        if (step2Data && step2Data.category) {
          console.log("✅ Step2 데이터 폴링 성공:", step2Data);
          stopPolling(); // 성공 시 폴링 중단 및 로딩 상태 false
          
          setCombinedResult(prevResult => {
            if (!prevResult) return null;
            const { analysisText: updatedAnalysisText } = 
              processStep2Result(baseAnalysisText, step2Data, errorStep2 || undefined); // errorStep2를 processStep2Result에 전달
            
            if (!step1IsNormal) { // Step 1이 비정상인 경우
              setShowDetailedDiagnosisButton(true); // 세부 진단 버튼 표시
              // setShowChatWithAIButton(false); // AI 채팅 버튼은 항상 false 또는 관련 로직 완전 제거
            }
            
            return {
              ...prevResult,
              step2Result: step2Data,
              currentAnalysisText: updatedAnalysisText,
            };
          });
          return true;
        }
        // 결과가 아직 없으면 false 반환하여 계속 폴링
        return false; 
      } catch (err) {
        console.error("Step2 폴링 중 에러:", err);
        stopPolling(); // 에러 발생 시 폴링 중단 및 로딩 상태 false
        setCombinedResult(prevResult => {
            if (!prevResult) return null;
            return {
                ...prevResult,
                currentAnalysisText: processStep2Result(baseAnalysisText, null, err instanceof Error ? err.message : "알 수 없는 오류").analysisText,
            };
        });
        return false; 
      }
    };
    
    const stopPolling = () => {
      if (pollingStatusRef.current.intervalId) {
        clearInterval(pollingStatusRef.current.intervalId);
        pollingStatusRef.current.intervalId = null;
      }
      pollingStatusRef.current.isPolling = false;
      setStep2Polling(false); // 폴링 종료 시 로딩 상태 false
    };
    
    const initialSuccess = await pollStep2Results();
    if (initialSuccess) return;
    
    const intervalId = setInterval(async () => {
      if (!pollingStatusRef.current.isPolling) {
        clearInterval(intervalId);
        return;
      }
      if (pollingStatusRef.current.attempts >= MAX_POLLING_ATTEMPTS) {
        console.log("⚠️ Step2 데이터 폴링 최대 시도 횟수 도달");
        stopPolling();
        setCombinedResult(prevResult => {
          if (!prevResult) return null;
          return {
            ...prevResult,
            currentAnalysisText: prevResult.currentAnalysisText + "\n\n질병 카테고리 분석이 지연되고 있습니다. 잠시 후 다시 시도해주세요.",
          };
        });
        return;
      }
      const success = await pollStep2Results();
      if (success) {
        stopPolling();
      }
    }, POLLING_INTERVAL);
    pollingStatusRef.current.intervalId = intervalId;
    return stopPolling; // useEffect cleanup 함수로 사용될 수 있도록 반환
  }, [getDiseaseCategory, errorStep2, processStep2Result]);

  useEffect(() => {
    if (!idParam) {
      setIsLoadingPage(false);
      console.error("Diagnosis ID is missing.");
      setCombinedResult(null);
      return;
    }

    async function loadDiagnosisData(currentId: string) {
      setIsLoadingPage(true);
      setShowDetailedDiagnosisButton(false);
      // setShowChatWithAIButton(false); // AI 채팅 버튼 상태 제거
      try {
        const isNormal = isNormalParam === 'true';
        const confidence = confidenceParam ? parseFloat(confidenceParam) : undefined;
        const decodedImageUrl = imageUrlParam ? decodeURIComponent(imageUrlParam) : null;

        const step1ResultData: DiagnosisResponse = {
          id: currentId,
          is_normal: isNormal,
          confidence: confidence ?? 0,
        };

        let baseAnalysisText = "";
        if (isNormal) {
          baseAnalysisText = "고양이에게 문제가 보이지 않습니다.";
        } else {
          baseAnalysisText = "질병이 의심됩니다. AI가 추가 분석을 진행합니다.";
        }
        if (confidence !== undefined) {
          const confidencePercentage = (Math.min(99.99, confidence * 100)).toFixed(2);
          baseAnalysisText += `\n(초기 판단 신뢰도: ${confidencePercentage}%)`;
        }

        setCombinedResult({
          step1Result: step1ResultData,
          step2Result: null,
          previewImageUrl: decodedImageUrl,
          currentAnalysisText: baseAnalysisText,
          statusText: isNormal ? "정상" : "질병 의심",
        });

        setIsLoadingPage(false);

        if (!isNormal) {
          pollStep2Data(currentId, baseAnalysisText, isNormal);
        }
      } catch (error) {
        console.error("Error loading diagnosis data:", error);
        setCombinedResult(null);
        setIsLoadingPage(false);
      }
    }
    
    loadDiagnosisData(idParam);
    
    return () => { // Cleanup 함수
      if (pollingStatusRef.current.intervalId) {
        clearInterval(pollingStatusRef.current.intervalId);
        pollingStatusRef.current.intervalId = null;
      }
      pollingStatusRef.current.isPolling = false;
      setStep2Polling(false);
    };
  }, [idParam, isNormalParam, imageUrlParam, confidenceParam, pollStep2Data]); // pollStep2Data를 의존성 배열에 추가


  if (isLoadingPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">진단 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (!combinedResult || !combinedResult.step1Result) {
    return <div className="p-4 text-center text-red-500">진단 결과를 표시할 수 없습니다.</div>
  }

  const { step1Result, step2Result, previewImageUrl, currentAnalysisText, statusText } = combinedResult;
  const isNormal = step1Result.is_normal;

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="AI 진단 결과" backUrl="/diagnosis/new" />

      <div className="p-4 flex-1">
        <div className="mb-6 w-full h-auto aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xl font-semibold overflow-hidden">
          {previewImageUrl ? (
            <Image
              src={previewImageUrl}
              alt="진단 이미지"
              width={400}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <span>이미지 없음</span>
          )}
        </div>

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-900">진단 결과</h2>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            isNormal ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {statusText}
          </span>
        </div>
        
        <div className={`${
            isNormal ? "bg-green-50" : "bg-red-50"
          } p-4 rounded-lg shadow-sm min-h-[150px]`}>
          <div className="flex items-center gap-2 mb-2">
            <Image src="/images/robot-icon.png" alt="AI" width={20} height={20} />
            <span className="font-semibold text-sm text-gray-800">AI 분석 결과</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">수의사 AI의 진단 의견입니다.</p>
          
          {/* Step 2 폴링 중 로딩 스피너 표시 */}
          {step2Polling && !isNormal && (
            <div className="flex items-center justify-center my-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <p className="ml-2 text-sm text-blue-600">
                질병 카테고리 분석 중...
              </p>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-800 whitespace-pre-line">
            {renderAnalysisText(currentAnalysisText)}
          </p>
        </div>

        {/* 비정상이고, Step2 폴링이 끝났고 (step2Polling === false), ID가 있을 때 세부 진단 버튼 표시 */}
        {!isNormal && showDetailedDiagnosisButton && !step2Polling && step1Result.id && (
          <div className="mt-6 text-center p-4 border border-blue-300 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-3">
              세부 질병 진단을 위해 추가 질문이 필요합니다.
            </p>
            <button
              onClick={() => router.push(`/diagnosis/detailedDiagnosis?id=${step1Result.id}`)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors text-base font-medium shadow-md"
            >
              세부 질병 진단으로 이동
            </button>
          </div>
        )}

        {/* AI 채팅 버튼 관련 UI 완전 삭제 */}
        {/* {!isNormal && showChatWithAIButton && !step2Polling && step1Result.id && step2Result && step2Result.category && (
          // ... AI 채팅 버튼 UI ...
        )}
        */}

        <div className="mt-8 text-center">
            <button
                onClick={() => router.push('/')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-base font-medium shadow-md"
            >
                홈으로 돌아가기
            </button>
        </div>
      </div>
    </div>
  )
}

export default function DiagnosisResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">페이지 로딩 중...</p>
      </div>
    }>
      <DiagnosisResultContent />
    </Suspense>
  );
}