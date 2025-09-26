"use client"

import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useChatting } from "@/hooks/use-chatting";
import { Loader2,  } from "lucide-react";
import { getMyDiagnoses } from "@/api/diagnosis/diagnosis.api";
import { Diagnosis } from "@/api/diagnosis/diagnosis.types";
import { Stethoscope, ClipboardList, AlertTriangle, MessageSquarePlus } from "lucide-react"; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; 



export type ChatRecord = {
  id: string;
  question: string;
  answer: string;
  date: string;
};

const parseContent = (text: string | undefined) => {
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

function MarkdownRenderer({ content }: { content: string }) {
    if(!content) return null;
 
    // '**'를 <strong> 태그로 변환합니다.
    const boldedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
 
    return boldedContent.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return null;

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

export default function RecordsPage() {
  const router = useRouter();
  const [chatRecords, setChatRecords] = useState<ChatRecord[] | null>(null);
  const [diagnosisRecords, setDiagnosisRecords] = useState<Diagnosis[] | null>(null);
  const { fetchChatList, fetchChatHistory } = useChatting();
   const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null); 
  
  const renderFormattedText = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  useEffect(() => {
    async function loadDiagnosisRecords() {
      try {
        const response = await getMyDiagnoses();
        if (response.success) {
          setDiagnosisRecords(response.data.diagnoses);
        } else {
          console.error("진단 기록을 불러오는데 실패했습니다:", response.error);
          setDiagnosisRecords([]); // 에러 발생 시 빈 배열로 설정
        }
      } catch (error) {
        console.error("진단 기록 요청 중 에러 발생:", error);
        setDiagnosisRecords([]); // 에러 발생 시 빈 배열로 설정
      }
    }

    async function loadChatRecords() {
      const sessionItems = await fetchChatList();

      if (sessionItems) {
        const recordsPromises = sessionItems.map(async (session) => {
          const history = await fetchChatHistory(session.session_id);
          
          if (history && history.length > 0) {
            let question: string;
            let answer: string;

            // 두 번째 Q&A가 있으면 사용하고, 없으면 첫 번째 Q&A를 사용합니다.
            if (history.length > 1 && history[1]) {
              question = history[1].question;
              answer = history[1].answer;
            } else {
              question = history[0].question;
              answer = history[0].answer;
            }
            
            if (answer && answer.length > 200) {
              answer = answer.substring(0, 200) + "...";
            }

            const dateObj = new Date(session.created_at);
            const datePart = `${String(dateObj.getFullYear()).slice(-2)}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
            
            return {
              id: session.session_id,
              question: question,
              answer: answer,
              date: datePart,
            };
          }
          return null;
        });
        
        // 3. 모든 작업이 끝날 때까지 기다린 후, 유효한 데이터만 저장합니다.
        const resolvedRecords = (await Promise.all(recordsPromises))
          .filter((record): record is ChatRecord => record !== null);
        
        setChatRecords(resolvedRecords);
      } else {
        setChatRecords([]); // 데이터가 없으면 빈 배열로 설정
      }
    }



    
    loadDiagnosisRecords();
    loadChatRecords();
  }, [fetchChatList, fetchChatHistory]);

  if (!chatRecords || !diagnosisRecords) return null;

  return (
    <div className="pb-16 flex flex-col min-h-screen bg-white">
      <Header title="기록" showSettings />
  
      <div className="p-4 space-y-8">

        {/* 고양이 눈 질병 기록 */}
        <section>
          <h2 className="text-lg font-bold mb-4">고양이 눈 질병 기록</h2>

          <div className="space-y-4">
            {diagnosisRecords.map((record) => {
              // 날짜 포맷팅 로직
              const dateObj = new Date(record.created_at);
              const datePart = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
              
              // 진단명 또는 기본 텍스트 설정
              const title = record.third_step?.category || (record.is_normal ? "정상" : "질병 진단");
              

              return (
                <div
                  key={record.id}
                   onClick={() => setSelectedDiagnosis(record)} // 클릭 시 selectedDiagnosis 상태를 현재 기록으로 설정
                  className="block border rounded-lg p-4 shadow-sm hover:bg-gray-50 cursor-pointer" 
                >
                  <div className="flex gap-4">
                    <Image
                      src={record.image_url}
                      alt="고양이 눈 진단 이미지"
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                      unoptimized // 외부 URL 이미지 사용 시 필요할 수 있음
                    />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">{title}</p>
                      <p className="text-sm text-gray-600">{datePart}</p>
                      <div className="text-sm text-gray-700 space-y-1 border-t pt-2">
           {record.third_step?.attribute_analysis && Object.keys(record.third_step.attribute_analysis).length > 0 ? (
  <ul className="pl-1 text-xs text-gray-500 space-y-1">
    {Object.entries(record.third_step.attribute_analysis).map(([key, value]) => (
      <li key={key} className="flex items-start">
        <span className="mr-1.5 mt-0.5">•</span>
        <span className="flex-1">
          <span className="font-semibold">{key}:</span> 
          {/* value의 타입을 명시하고, 내용이 너무 길지 않게 25자만 잘라서 보여줍니다. */}
          {(value as { llmAnalysis: string }).llmAnalysis.substring(0, 25)}...
        </span>
      </li>
    ))}
  </ul>
) : null}
        </div>
                    </div>
                  </div>
                  <div className="text-blue-500 mt-3 text-center border-t pt-2 text-sm">상세보기</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* AI 상담 기록 */}
        <section>
          <h2 className="text-lg font-bold mb-4">AI 상담 기록</h2>

          <div className="space-y-4">
            {chatRecords.map((record) => (
              <Link 
                key={record.id}
                href={`/chat?session_id=${record.id}`} 
                className="block border rounded-lg p-4 shadow-sm hover:bg-gray-50"
              >
                <div className="mb-2">
                  <p className="font-medium text-gray-800">Q: {record.question}<span className="text-gray-400 text-xs ml-2">({record.date})</span></p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                   A: {renderFormattedText(record.answer)}
                   </p>
                </div>
                <div className="text-blue-500 mt-3 text-center border-t pt-2 text-sm">상세보기</div>
              </Link>
            ))}
          </div>
        </section>

      {selectedDiagnosis && (
  <div className="fixed top-0 left-0 w-screen h-screen z-50 flex justify-center items-center p-4">
    <div className="bg-slate-50 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      {/* 헤더 및 닫기 버튼 */}
      <div className="sticky top-0 bg-white p-4 border-b rounded-t-xl flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">상세 진단 결과</h2>
          <button
            onClick={() => setSelectedDiagnosis(null)}
            className="text-gray-400 hover:text-gray-700 text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="overflow-y-auto px-4 py-6 space-y-5">
        
        {/* --- 최종 진단명 --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Stethoscope className="h-6 w-6" />
            <h2 className="text-xl font-bold">AI 최종 진단</h2>
          </div>
          <p className="text-2xl text-center font-bold text-slate-800 bg-blue-50 p-5 rounded-lg">
            {selectedDiagnosis.third_step?.category || (selectedDiagnosis.is_normal ? "정상" : "질병 진단")}
          </p>
        </div>

        {/* --- 진단 요약 --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <ClipboardList className="h-6 w-6" />
            <h2 className="text-xl font-bold">진단 요약</h2>
          </div>
          <div className="text-sm text-slate-600 whitespace-pre-line bg-gray-50 p-4 rounded-md">
            {selectedDiagnosis.third_step?.summary || "요약 정보가 없습니다."}
          </div>
        </div>
        
        {/* --- 상세 분석 및 관리 안내 (토글) --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
                <ClipboardList className="h-6 w-6" />
                <h2 className="text-xl font-bold">상세 분석 및 관리 안내</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {parseContent(selectedDiagnosis.third_step?.details).map((section, index) => (
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

        {/* --- 주의사항 --- */}
        <div className="mt-6 text-center space-y-6">
            <div className="bg-amber-100/60 p-4 rounded-lg border border-amber-200 flex items-start text-left gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="flex-1 text-sm text-amber-800">
                    <strong>주의:</strong> AI의 분석 결과는 참고용이며, 정확한 진단과 치료는 반드시 수의사와 상담하시기 바랍니다.
                </p>
            </div>

            <button
    onClick={() => {
      if (!selectedDiagnosis) return;
      const category = selectedDiagnosis.third_step?.category || "진단 결과";
      const initialChatMessage = `진단된 질병: ${category}`;
      router.push(`/chat?initialMessage=${encodeURIComponent(initialChatMessage)}&diagnosis_id=${selectedDiagnosis.id}`);
    }}
    className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-base font-medium shadow-md"
  >
    <MessageSquarePlus className="h-5 w-5" />
    AI와 채팅하기
  </button>
        </div>
      </div>
    </div>
  </div>
)}
{/* =============== 상세 정보 모달 끝 =============== */}

      </div>
    </div>
  )
}
