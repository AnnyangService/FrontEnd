"use client"

import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { useRef, useEffect, useState } from "react";
import { useChatting } from "@/hooks/use-chatting";
import { Loader2 } from "lucide-react";


export type DiagnosisRecord = {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
};

export type ChatRecord = {
  id: string;
  question: string;
  answer: string;
  date: string;
};

export async function getDiagnosisRecords(): Promise<DiagnosisRecord[]> {
  return [
    {
      id: 1,
      title: "눈 결막염 진단",
      date: "2025.02.15",
      description: "눈물이 많이 나고 충혈이 심함",
      image: "/images/cat-closeup.png",
    },
    {
      id: 2,
      title: "정기 검진",
      date: "2025.02.10",
      description: "양호 / 특이사항 없음",
      image: "/images/cat-nabi.png",
    },
  ];
}


export default function RecordsPage() {
  const [chatRecords, setChatRecords] = useState<ChatRecord[] | null>(null);
  const [diagnosisRecords, setDiagnosisRecords] = useState<DiagnosisRecord[] | null>(null);
  const { fetchChatList, fetchChatHistory } = useChatting();
  
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
    async function loadRecords() {
      const data = await getDiagnosisRecords();
      setDiagnosisRecords(data);
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



    
    loadRecords();
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
            {diagnosisRecords.map((record) => ( 
              <Link 
                key={record.id}
                href={`/diagnosis/result?id=${record.id}`} 
                className="block border rounded-lg p-4 shadow-sm hover:bg-gray-50"
              >
                <div className="flex gap-4">
                  <Image
                    src="/images/cat-closeup.png"
                    alt="고양이 눈"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">{record.title}</p>
                    <p className="text-sm text-gray-600">{record.date}</p>
                    <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                  </div>
                </div>
                <div className="text-blue-500 mt-3 text-center border-t pt-2 text-sm">상세보기</div>
              </Link>
            ))}
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

      </div>
    </div>
  )
}
