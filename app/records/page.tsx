"use client"

import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { useRef, useEffect, useState } from "react";


export type DiagnosisRecord = {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
};

export type ChatRecord = {
  id: number;
  question: string;
  answer: string;
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

export async function getChatRecords(): Promise<ChatRecord[]> {
  return [
    {
      id: 1,
      question: "고양이 눈 건강 관리는 어떻게 해야 하나요?",
      answer: "정기적인 청결 관리와 이상 증상 관찰이 중요합니다.",
    },
  ];
}

export default function RecordsPage() {
  const [chatRecords, setChatRecords] = useState<ChatRecord[] | null>(null);
  const [diagnosisRecords, setDiagnosisRecords] = useState<DiagnosisRecord[] | null>(null);
  

  useEffect(() => {
    async function loadRecords() {
      const data = await getDiagnosisRecords();
      setDiagnosisRecords(data);
    }
    async function loadChatRecords() {
      const data = await getChatRecords();
      setChatRecords(data);
    }
    loadRecords();
    loadChatRecords();
  }, []);

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
                href={`/chat/result?id=${record.id}`} 
                className="block border rounded-lg p-4 shadow-sm hover:bg-gray-50"
              >
                <div className="mb-2">
                  <p className="font-medium text-gray-800">Q: {record.question}</p>
                  <p className="text-sm text-gray-600 mt-1">A: {record.answer}</p>
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
