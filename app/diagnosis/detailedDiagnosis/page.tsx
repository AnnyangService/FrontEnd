"use client"

import { Suspense, useState, useEffect } from "react"
import Header from "@/components/header"
import { useSearchParams, useRouter } from "next/navigation"
import { useDiagnosis } from "@/hooks/use-diagnosis"
import { DiagnosisAttribute, SubmittedAttribute, DetailedDiagnosisResponse } from "@/api/diagnosis/diagnosis.types"
import { Loader2, Stethoscope, ClipboardList, AlertTriangle, Home, MessageSquarePlus, ChevronDown, CheckCircle2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface DynamicFormData {
  [key: string]: string;
}

type UIState = "LOADING_QUESTIONS" | "QUESTION_FORM" | "SUBMITTING_ANSWERS" | "SHOWING_FINAL_RESULT" | "ERROR_STATE";

// 텍스트를 파싱하여 제목과 내용으로 나누는 헬퍼 함수
const parseContent = (text: string) => {
    if (!text) return [];
    // 제목 형식: # 1. 제목 / # 2. 제목 등
    const sections = text.split(/(?=# \d+\. )/g).filter(s => s.trim() !== '');
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0] || '';
      const content = lines.slice(1).join('\n');
      return { title, content };
    });
};
  
// Markdown 형식의 텍스트를 JSX로 렌더링하는 컴포넌트
function MarkdownRenderer({ content }: { content: string }) {
    if(!content) return null;

    // '**'를 <strong> 태그로 변환합니다.
    const boldedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return boldedContent.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return null;

        if (trimmedLine.startsWith('## [')) {
            return <h4 key={index} className="text-md font-semibold text-gray-700 mt-4 mb-2">{trimmedLine.replace('## [', '').replace(']', '')}</h4>;
        }

        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('• ')) {
            const itemContent = trimmedLine.substring(1).trim();
            const colonIndex = itemContent.indexOf(':');
            const hasColon = colonIndex !== -1;
            const parts = hasColon
                ? [itemContent.slice(0, colonIndex), itemContent.slice(colonIndex + 1)]
                : [itemContent];

            return (
                <div key={index} className="flex items-start pl-1 mt-2">
                    <span className="text-blue-500 font-bold mt-1 mr-2">•</span>
                     <p className="flex-1 text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: hasColon ? `<span class="font-semibold text-slate-800">${parts[0]}:</span>${parts[1]}` : itemContent }} />
                </div>
            );
        }
        
        return <p key={index} className="text-slate-600 leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: trimmedLine }}/>;
    });
}


function EyeDiagnosisFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diagnosisIdFromParams = searchParams.get('id');

  const { getDiagnosisAttributes, submitDetailedDiagnosis } = useDiagnosis();

  const [questions, setQuestions] = useState<DiagnosisAttribute[]>([]);
  const [formData, setFormData] = useState<DynamicFormData>({});
  const [finalResult, setFinalResult] = useState<DetailedDiagnosisResponse | null>(null);
  const [uiState, setUiState] = useState<UIState>("LOADING_QUESTIONS");
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof diagnosisIdFromParams === 'string' && diagnosisIdFromParams.length > 0) {
      setUiState("LOADING_QUESTIONS");
      async function fetchAttributes(currentId: string) {
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
            throw new Error("질문 목록을 가져오는데 실패했습니다. (응답 데이터 문제)");
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "질문 목록 로딩 중 알 수 없는 오류 발생";
          console.error("Error fetching attributes:", err);
          setPageError(errorMessage);
          setUiState("ERROR_STATE");
        }
      }
      fetchAttributes(diagnosisIdFromParams);
    } else {
      console.error("Diagnosis ID is missing or invalid from URL.");
      setPageError("잘못된 접근입니다. 유효한 진단 ID가 필요합니다.");
      setUiState("ERROR_STATE");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosisIdFromParams]);

  const handleChange = (questionId: number, value: string) => {
    setFormData(prev => ({ ...prev, [String(questionId)]: value }));
  };

  const isComplete = questions.length > 0 && questions.every(q => {
    const value = formData[String(q.id)];
    return value !== undefined && value.trim() !== "";
  });

  const handleSubmit = async () => {
    if (!isComplete || typeof diagnosisIdFromParams !== 'string' || !diagnosisIdFromParams) {
      setPageError("모든 질문에 답변해야 하거나, 진단 ID가 유효하지 않습니다.");
      return;
    }
    const currentDiagnosisId: string = diagnosisIdFromParams;

    setUiState("SUBMITTING_ANSWERS");
    setPageError(null);

    const submittedAttributes: SubmittedAttribute[] = questions
      .map(q => ({
        diagnosisRuleId: q.id.toString(),
        userResponse: formData[String(q.id)]
      }));

    try {
      const response = await submitDetailedDiagnosis({
        diagnosisId: currentDiagnosisId,
        userResponses: submittedAttributes,
      });

      if (response && response.category) {
        setFinalResult(response);
        setUiState("SHOWING_FINAL_RESULT");
      } else {
        throw new Error("세부 진단 제출 후 유효한 응답이 없습니다. 서버 오류일 수 있습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "세부 진단 제출 중 알 수 없는 에러가 발생했습니다.";
      console.error("Error submitting detailed diagnosis:", err);
      setPageError(errorMessage);
      setUiState("ERROR_STATE");
    }
  };

  // --- UI 렌더링 로직 ---
  if (uiState === "LOADING_QUESTIONS" || uiState === "SUBMITTING_ANSWERS") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">
            {uiState === 'SUBMITTING_ANSWERS' ? '결과를 분석 중입니다...' : '질문 목록을 불러오는 중...'}
        </p>
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

    return (
        <div className="pb-24 bg-slate-50 min-h-screen">
            <Header title="최종 AI 진단 결과" backUrl={diagnosisIdFromParams ? `/diagnosis/result?id=${diagnosisIdFromParams}` : "/"} />
            
            <div className="px-4 py-6 space-y-5">
                {/* --- 최종 진단명 --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <Stethoscope className="h-6 w-6" />
                        <h2 className="text-xl font-bold">AI 최종 진단</h2>
                    </div>
                    <p className="text-2xl text-center font-bold text-slate-800 bg-blue-50 p-5 rounded-lg">
                        {finalResult.category}
                    </p>
                </div>

                {/* --- 진단 요약 --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <ClipboardList className="h-6 w-6" />
                        <h2 className="text-xl font-bold">진단 요약</h2>
                    </div>
                    <div className="text-sm text-slate-600 whitespace-pre-line bg-gray-50 p-4 rounded-md">
                        {finalResult.summary}
                    </div>
                </div>

                
                
                {/* --- 증상별 상세 분석 (토글) --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <ClipboardList className="h-6 w-6" />
                        <h2 className="text-xl font-bold">증상별 상세 분석</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {Object.entries(finalResult.attribute_analysis).map(([key, value], index) => (
                            <AccordionItem value={`attr-${index}`} key={index}>
                                <AccordionTrigger className="text-md font-semibold text-gray-800 hover:no-underline text-left gap-2 py-4">
            <div className="flex-1 flex flex-col items-start">
                <span className="font-bold text-slate-800">{key}</span>
                {/* 사용자 답변을 여기에 표시합니다 */}
                <p className="font-normal text-sm text-gray-500 mt-1 text-left italic">
                    "{value.user_input}"
                </p>
            </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-4 px-1 space-y-4 bg-slate-50 rounded-b-lg">
            {/* AI 분석 결과를 여기에 표시합니다 */}
            <div className="bg-white p-3 rounded-md mt-2 border">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <CheckCircle2 className="h-4 w-4"/>
                    <span>{value.most_similar_disease} (유사도: {(value.similarity * 100).toFixed(1)}%)</span>
                </div>
            </div>
            <MarkdownRenderer content={value.llm_analysis} />
        </AccordionContent>
                                <AccordionContent className="pt-2 pb-4 px-1 space-y-4 bg-slate-50 rounded-b-lg">
                                   
                                   <MarkdownRenderer content={value.llm_analysis} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* --- 상세 분석 및 관리 안내 (토글) --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <ClipboardList className="h-6 w-6" />
                        <h2 className="text-xl font-bold">상세 분석 및 관리 안내</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {parseContent(finalResult.details).map((section, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline text-left">
                                    {section.title.replace(/#\s\d+\.\s/, '')}
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4 px-1">
                                <MarkdownRenderer content={section.content} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* --- 주의사항 및 액션 버튼 --- */}
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

  // --- 질문 입력 폼 UI ---
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
          disabled={!isComplete}
          className={`w-full py-3 rounded-lg mt-4 transition text-center font-semibold ${
            (!isComplete)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {"최종 진단 결과 확인"}
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