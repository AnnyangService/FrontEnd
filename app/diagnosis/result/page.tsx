"use client"

/*
URL로 넘어온 정보들 일단 보여주고(step1)
step2로딩, 로딩 끝나면 보여줌
만약 step3필요한 경우 step3로 이동하는 버튼 생성
(나중에 채팅으로 이동하는거 추가, 어떤 방식으로 step3갈지 변경)

*/

import { Suspense, useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Image from "next/image"
import { useDiagnosis } from "@/hooks/use-diagnosis"
import type { DiagnosisResponse, DiagnosisStep2Response } from "@/api/diagnosis/diagnosis.types"
import { Loader2 } from "lucide-react"

// 이 페이지에서 표시할 전체 진단 결과의 상태 타입
interface CombinedDiagnosisResult {
  step1Result: DiagnosisResponse | null; // Step 1 API (checkDiseaseStatus)의 결과
  step2Result: DiagnosisStep2Response | null; // Step 2 API (getDiseaseCategory)의 결과
  previewImageUrl: string | null; // NewDiagnosisPage에서 전달된 이미지 URL.
  currentAnalysisText: string; // 화면에 표시될 최종 분석 텍스트
  statusText: string; // "정상", "질병 의심" 등
}

// 세부 진단이 필요한 질병 카테고리 목록 (예시)
const STEP_3_DISEASE_CATEGORIES = ["결막염 의심", "각막염 의심", "포도막염 의심"];

function DiagnosisResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getDiseaseCategory, loadingStep2, errorStep2 } = useDiagnosis()

  const idParam = searchParams.get('id') // Step 1 결과의 ID
  const isNormalParam = searchParams.get('isNormal')
  const imageUrlParam = searchParams.get('imageUrl')
  const confidenceParam = searchParams.get('confidence')

  const [combinedResult, setCombinedResult] = useState<CombinedDiagnosisResult | null>(null)
  const [isLoadingPage, setIsLoadingPage] = useState(true)
  const [showDetailedDiagnosisButton, setShowDetailedDiagnosisButton] = useState(false);

  const processStep2Result = useCallback((step1Analysis: string, step2Data: DiagnosisStep2Response | null, step2Error?: string | null) => {
    let analysisText = step1Analysis;
    let needsDetailedDiagnosis = false;
    if (step2Data) {
      const categoryConfidencePercentage = (step2Data.confidence * 100).toFixed(1);
      analysisText += `\n\n의심되는 질병 카테고리: ${step2Data.category} (신뢰도: ${categoryConfidencePercentage}%)`;
      // Step 2 결과 카테고리가 세부 진단 필요 목록에 있는지 확인
      if (STEP_3_DISEASE_CATEGORIES.includes(step2Data.category)) {
        needsDetailedDiagnosis = true;
      }
    } else if (step2Error) {
      analysisText += `\n\n질병 카테고리 분석 중 오류 발생: ${step2Error}`;
    } else {
      analysisText += `\n\n질병 카테고리를 특정할 수 없습니다.`;
    }
    return { analysisText, needsDetailedDiagnosis };
  }, []);

  const MAX_POLLING_ATTEMPTS = 20; // 최대 폴링 시도 횟수 (약 1분)
  const POLLING_INTERVAL = 3000; // 폴링 간격 (3초)
  
  // useRef를 사용하여 폴링 관련 상태를 관리 (렌더링 사이클과 무관하게 값 유지)
  const pollingStatusRef = useRef({
    isPolling: false,
    attempts: 0,
    intervalId: null as NodeJS.Timeout | null
  });
  
  const [step2Polling, setStep2Polling] = useState(false);

  // Step2 결과를 폴링하는 함수
  const pollStep2Data = useCallback(async (diagnosisId: string, baseAnalysisText: string) => {
    // 이미 폴링 중이면 중복 실행 방지
    if (pollingStatusRef.current.isPolling) return;
    
    // 폴링 시작 상태 설정
    pollingStatusRef.current.isPolling = true;
    pollingStatusRef.current.attempts = 0;
    setStep2Polling(true);
    
    const pollStep2Results = async () => {
      // ref를 사용하여 시도 횟수 증가 (렌더링에 영향 없음)
      pollingStatusRef.current.attempts += 1;
      
      console.log(`🔄 Step2 데이터 폴링 시도 #${pollingStatusRef.current.attempts}`);
      
      try {
        const step2Data = await getDiseaseCategory(diagnosisId);
        
        // 유효한 결과가 있으면 폴링 중단
        if (step2Data && step2Data.category) {
          console.log("✅ Step2 데이터 폴링 성공:", step2Data);
          
          // 폴링 중단 처리
          stopPolling();
          
          // 결과 업데이트
          setCombinedResult(prevResult => {
            if (!prevResult) return null;
            const { analysisText: updatedAnalysisText, needsDetailedDiagnosis } = 
              processStep2Result(baseAnalysisText, step2Data, errorStep2 || undefined);
            
            if (needsDetailedDiagnosis) {
              setShowDetailedDiagnosisButton(true);
            }
            
            return {
              ...prevResult,
              step2Result: step2Data,
              currentAnalysisText: updatedAnalysisText,
            };
          });
          
          return true; // 폴링 성공
        }
        
        return false; // 아직 유효한 결과 없음, 계속 폴링
      } catch (err) {
        console.error("Step2 폴링 중 에러:", err);
        return false;
      }
    };
    
    // 폴링을 중단하는 함수
    const stopPolling = () => {
      if (pollingStatusRef.current.intervalId) {
        clearInterval(pollingStatusRef.current.intervalId);
        pollingStatusRef.current.intervalId = null;
      }
      pollingStatusRef.current.isPolling = false;
      setStep2Polling(false);
    };
    
    // 최초 한 번 즉시 폴링 시도
    const initialSuccess = await pollStep2Results();
    if (initialSuccess) return;
    
    // 초기 시도 실패 시 인터벌로 주기적 폴링 실행
    const intervalId = setInterval(async () => {
      // 이미 폴링이 중단되었으면 인터벌도 정리
      if (!pollingStatusRef.current.isPolling) {
        clearInterval(intervalId);
        return;
      }
      
      // 최대 시도 횟수 초과 시 폴링 중단
      if (pollingStatusRef.current.attempts >= MAX_POLLING_ATTEMPTS) {
        console.log("⚠️ Step2 데이터 폴링 최대 시도 횟수 도달");
        stopPolling();
        
        // 타임아웃 메시지 추가
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
    
    // 인터벌 ID 저장
    pollingStatusRef.current.intervalId = intervalId;
    
    // cleanup 함수
    return stopPolling;
  }, [getDiseaseCategory, errorStep2, processStep2Result]); // pollingAttempts 의존성 제거

  useEffect(() => {
    if (!idParam) {
      setIsLoadingPage(false);
      console.error("Diagnosis ID is missing.");
      setCombinedResult(null);
      return;
    }

    async function loadDiagnosisData(currentId: string) {
      setIsLoadingPage(true);
      setShowDetailedDiagnosisButton(false); // 버튼 상태 초기화
      
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
          const confidencePercentage = (confidence * 100).toFixed(1);
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

        // 질병 의심 상태인 경우에만 Step2 폴링 시작
        if (!isNormal) {
          pollStep2Data(currentId, baseAnalysisText);
        }
      } catch (error) {
        console.error("Error loading diagnosis data:", error);
        setCombinedResult(null);
        setIsLoadingPage(false);
      }
    }
    
    loadDiagnosisData(idParam);
    
    // 컴포넌트 언마운트 시 폴링 중단
    return () => {
      // 인터벌 정리
      if (pollingStatusRef.current.intervalId) {
        clearInterval(pollingStatusRef.current.intervalId);
        pollingStatusRef.current.intervalId = null;
      }
      pollingStatusRef.current.isPolling = false;
      setStep2Polling(false);
    };
  }, [idParam, isNormalParam, imageUrlParam, confidenceParam, pollStep2Data]);


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

        <p className="text-sm text-gray-500 mb-6">
          진단 ID: {step1Result.id}
        </p>
        
        <div className={`${
            isNormal ? "bg-green-50" : "bg-red-50"
          } p-4 rounded-lg shadow-sm min-h-[150px]`}>
          <div className="flex items-center gap-2 mb-2">
            <Image src="/images/robot-icon.png" alt="AI" width={20} height={20} />
            <span className="font-semibold text-sm text-gray-800">AI 분석 결과</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">수의사 AI의 진단 의견입니다.</p>
          
          {(loadingStep2 || step2Polling) && !isNormal && (
            <div className="flex items-center justify-center my-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <p className="ml-2 text-sm text-blue-600">
                {step2Polling 
                  ? `질병 카테고리 분석 중...` 
                  : "추가 분석 중..."
                }
              </p>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-800 whitespace-pre-line">
            {currentAnalysisText}
          </p>
        </div>

        {/* 세부 진단 필요 메시지 및 버튼 표시 조건 */}
        {!isNormal && showDetailedDiagnosisButton && !loadingStep2 && step1Result.id && (
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