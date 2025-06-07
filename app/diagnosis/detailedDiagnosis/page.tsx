"use client"

/*일단 결과값 이페이지에서 보이게
  나중에 채팅으로 이동하거나 결과페이지 생성??
*/

import { Suspense, useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import { useSearchParams, useRouter } from "next/navigation"
import { useDiagnosis } from "@/hooks/use-diagnosis"
import { DiagnosisAttribute, SubmittedAttribute, DetailedDiagnosisResponse } from "@/api/diagnosis/diagnosis.types"
import { Loader2, Stethoscope, ClipboardList, AlertTriangle, Home, MessageSquarePlus } from "lucide-react"
import Image from "next/image" 

interface DynamicFormData {
  [key: string]: string;
}

type UIState = "LOADING_QUESTIONS" | "QUESTION_FORM" | "SUBMITTING_ANSWERS" | "SHOWING_FINAL_RESULT" | "ERROR_STATE";

function EyeDiagnosisFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diagnosisIdFromParams = searchParams.get('id'); // string | null

  const { 
    getDiagnosisAttributes, 
    submitDetailedDiagnosis,
    // errorAttributes // pageError 상태로 직접 관리
  } = useDiagnosis();

  const [questions, setQuestions] = useState<DiagnosisAttribute[]>([]);
  const [formData, setFormData] = useState<DynamicFormData>({});
  const [finalResult, setFinalResult] = useState<DetailedDiagnosisResponse | null>(null);
  const [uiState, setUiState] = useState<UIState>("LOADING_QUESTIONS");
  const [pageError, setPageError] = useState<string | null>(null);


  useEffect(() => {
    // diagnosisIdFromParams가 유효한 문자열일 때만 fetchAttributes를 실행합니다.
    if (typeof diagnosisIdFromParams === 'string' && diagnosisIdFromParams.length > 0) {
      setUiState("LOADING_QUESTIONS");
      async function fetchAttributes(currentId: string) { // 명시적으로 string 타입 인자 받도록 수정
        try {
          const attributesResponse = await getDiagnosisAttributes(currentId);
          if (attributesResponse && attributesResponse.attributes) {
            setQuestions(attributesResponse.attributes);
            const initialFormData: DynamicFormData = {};
            attributesResponse.attributes.forEach(attr => {
              initialFormData[String(attr.id)] = "";
            });
            setFormData(initialFormData);
            setUiState("QUESTION_FORM");
            setPageError(null);
          } else {
            // getDiagnosisAttributes가 null을 반환하거나 attributes가 없는 경우
            // useDiagnosis 훅의 errorAttributes 상태를 참조하거나 일반 메시지 사용
            // const hookError = useDiagnosis().errorAttributes; // 훅 상태 직접 참조 대신 catch로 일관되게 처리
            throw new Error("질문 목록을 가져오는데 실패했습니다. (응답 데이터 문제)");
          }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "질문 목록 로딩 중 알 수 없는 오류 발생";
            console.error("Error fetching attributes:", err);
            setPageError(errorMessage);
            setUiState("ERROR_STATE");
        }
      }
      fetchAttributes(diagnosisIdFromParams); // 이 시점에서 diagnosisIdFromParams는 string
    } else {
      // diagnosisIdFromParams가 null이거나 빈 문자열인 경우
      console.error("Diagnosis ID is missing or invalid from URL.");
      setPageError("잘못된 접근입니다. 유효한 진단 ID가 필요합니다.");
      setUiState("ERROR_STATE");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosisIdFromParams, getDiagnosisAttributes, router]); // errorAttributes 의존성 제거 (훅 내부 처리)

  const handleChange = (questionId: number, value: string) => {
    setFormData(prev => ({ ...prev, [String(questionId)]: value }));
  };

  const isComplete = questions.length > 0 && questions.every(q => {
    const value = formData[String(q.id)];
    return value !== undefined && value.trim() !== "";
  });

  const handleSubmit = async () => {
    // diagnosisIdFromParams가 유효한 문자열인지 다시 한번 확인
    if (!isComplete || typeof diagnosisIdFromParams !== 'string' || !diagnosisIdFromParams) {
        setPageError("모든 질문에 답변해야 하거나, 진단 ID가 유효하지 않습니다.");
        if (!diagnosisIdFromParams) console.error("handleSubmit: Diagnosis ID is null or undefined.");
        return;
    }
    // 이 시점에서 diagnosisIdFromParams는 string 타입임이 보장됩니다.
    const currentDiagnosisId: string = diagnosisIdFromParams;

    setUiState("SUBMITTING_ANSWERS");
    setPageError(null);

    const submittedAttributes: SubmittedAttribute[] = questions
      .map(q => ({
        id: q.id, 
        description: formData[String(q.id)] 
      }));

    try {
      const response = await submitDetailedDiagnosis({
        diagnosis_id: currentDiagnosisId, 
        attributes: submittedAttributes,
      });

      if (response) {
        setFinalResult(response);
        setUiState("SHOWING_FINAL_RESULT");
      } else {
        // submitDetailedDiagnosis가 null을 반환하고, 훅 내부의 errorDetailedDiagnosis에 에러 메시지가 설정될 수 있음
        // (useDiagnosis 훅의 errorDetailedDiagnosis 상태를 직접 참조하는 것을 고려할 수 있음)
        throw new Error("세부 진단 제출 후 응답이 없습니다. 서버 오류일 수 있습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "세부 진단 제출 중 알 수 없는 에러가 발생했습니다.";
      console.error("Error submitting detailed diagnosis:", err);
      setPageError(errorMessage);
      setUiState("ERROR_STATE");
    }
  };

  // UI 렌더링 로직
  if (uiState === "LOADING_QUESTIONS") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">질문 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (uiState === "ERROR_STATE") {
    return (
      <div className="pb-16">
        <Header title="오류" backUrl={diagnosisIdFromParams ? `/diagnosis/result?id=${diagnosisIdFromParams}` : "/"} />
        <div className="p-4 text-center text-red-500">
          {pageError || "알 수 없는 오류가 발생했습니다."}
        </div>
        <div className="mt-8 text-center p-4">
            <button
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-base font-medium shadow-md"
            >
                뒤로 가기
            </button>
        </div>
      </div>
    );
  }
  
  if (uiState === "SHOWING_FINAL_RESULT" && finalResult) {
    const initialChatMessage = `진단된 질병: ${finalResult.category}`;
    const confidencePercentage = (finalResult.confidence * 100).toFixed(1);

    // 상세 설명을 파싱하고 렌더링하는 함수 (디자인 디테일 추가)
    const renderDescription = (text: string) => {
        const cleanedText = text.replace(/\*\*/g, '');
        return cleanedText.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') return null;
            
            // "## 의료 보고서"와 같은 메인 제목
            if (trimmedLine.startsWith('## ')) {
                // 이 부분은 카드 제목으로 대체되었으므로 렌더링하지 않음
                return null;
            }

            // "1. 진단 결과 요약"과 같은 섹션 제목
            if (/^\d+\.\s/.test(trimmedLine)) {
                return <h3 key={index} className="text-lg font-bold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">{trimmedLine}</h3>;
            }

            // "* 분비물 특성:" 과 같은 목록
            if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('• ')) {
                const content = trimmedLine.substring(1).trim();
                const parts = content.split(':');
                return (
                    <div key={index} className="flex items-start pl-1 mt-3">
                        <span className="text-blue-500 font-bold mt-1 mr-3">•</span>
                        <p className="flex-1 text-slate-700 leading-relaxed">
                            <span className="font-semibold text-slate-800">{parts[0]}:</span>
                            {parts.slice(1).join(':')}
                        </p>
                    </div>
                );
            }
            
            return <p key={index} className="text-slate-600 leading-relaxed">{trimmedLine}</p>;
        });
    };

    return (
      <div className="pb-24 bg-slate-50 min-h-screen">
        <Header title="최종 AI 진단 결과" backUrl={diagnosisIdFromParams ? `/diagnosis/result?id=${diagnosisIdFromParams}` : "/"} />
        
        <div className="px-4 py-6 space-y-5">
          {/* --- 1. AI 핵심 분석 요약 카드 (디자인 개선) --- */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <Stethoscope className="h-6 w-6" />
              <h2 className="text-xl font-bold">AI 진단 요약</h2>
            </div>
            <div className="space-y-2 text-base">
              <p className="text-slate-800">
                진단명: <strong className="font-bold text-blue-700">{finalResult.category}</strong>
              </p>
              <p className="text-slate-600">
                신뢰도: <strong className="font-bold">{confidencePercentage}%</strong>
              </p>
            </div>
          </div>

          {/* --- 2. 상세 설명 섹션 (디자인 개선) --- */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <ClipboardList className="h-6 w-6" />
              <h2 className="text-xl font-bold">상세 분석 및 관리 안내</h2>
            </div>
            <div className="space-y-2">
              {renderDescription(finalResult.description)}
            </div>
          </div>

          {/* --- 3. 주의사항 및 액션 버튼 (디자인 개선) --- */}
          <div className="mt-6 text-center space-y-6">
              <div className="bg-amber-100/60 p-4 rounded-lg border border-amber-200 flex items-start text-left gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="flex-1 text-sm text-amber-800">
                      <strong>주의:</strong> AI의 분석 결과는 참고용이며, 정확한 진단과 치료는 반드시 수의사와 상담하시기 바랍니다.
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                      onClick={() => router.push('/')} 
                      className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-base font-medium shadow-md"
                  >
                      <Home className="h-5 w-5" /> 홈으로
                  </button>
                  <button
                      onClick={() => router.push(`/chat?initialMessage=${encodeURIComponent(initialChatMessage)}`)}
                      className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-base font-medium shadow-md"
                  >
                      <MessageSquarePlus className="h-5 w-5" /> AI와 채팅
                  </button>
              </div>
          </div>
        </div>
      </div>
    );
}

  // 질문 입력 폼 UI (uiState === "QUESTION_FORM")
  return (
    <div className="pb-16">
      <Header title="자세한 정보를 알려주세요" backUrl={diagnosisIdFromParams ? `/diagnosis/result?id=${diagnosisIdFromParams}` : "/"} />
      <div className="px-4 py-6 space-y-8">
        {questions.map((question, idx) => {
          const value = formData[String(question.id)] || "";
          const isFilled = value.trim() !== "";
          return (
            <div key={question.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <label className="block font-semibold mb-2 text-gray-800">
                <span className="text-blue-600 mr-1">Q{idx + 1}.</span>
                {question.description}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name={String(question.id)}
                  value={value}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  placeholder="답변을 입력하세요"
                  className={`
                    w-full h-12 p-3 rounded-lg outline-none transition border 
                    ${isFilled ? "border-blue-500" : "border-gray-300 focus:border-red-400"} 
                    focus:ring-2 ${isFilled ? "focus:ring-blue-300" : "focus:ring-red-200"}
                  `}
                />
                {isFilled && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-lg">
                    ✔️
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {!isComplete && questions.length > 0 && (
          <p className="text-sm text-red-500 -mt-4">모든 항목을 입력해야 제출할 수 있어요.</p>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!isComplete || uiState === "SUBMITTING_ANSWERS"}
          className={`w-full py-3 rounded-lg mt-4 transition text-center font-semibold ${
            (!isComplete || uiState === "SUBMITTING_ANSWERS")
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {uiState === "SUBMITTING_ANSWERS" ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              제출 중...
            </div>
          ) : "최종 진단 결과 확인"}
        </button>
      </div>
    </div>
  )
}

export default function EyeDiagnosisFormPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">페이지 로딩 중...</p>
      </div>
    }>
      <EyeDiagnosisFormContent />
    </Suspense>
  );
}