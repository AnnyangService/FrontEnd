"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Image from "next/image"
import { DiagnosisResult } from "@/lib/types/diagnosis"

async function getDiagnosisResult(id: string): Promise<DiagnosisResult> {
  return {
    id,
    catName: "미오",
    date: "2025.02.15 15:30",
    status: "정상",
    image: "/images/cat-mio.png",
    analysis: "결막염 초기 증세가 의심됩니다."
  };
}

function DiagnosisResultContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadResult() {
      const data = await getDiagnosisResult(id as string);
      setResult(data);
    }
    loadResult();
  }, [id]);

  if (!result) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="상세" backUrl="/records" />

      <div className="p-4 flex-1">
        {/* 이미지 영역 */}
        <div className="mb-6 w-full h-[240px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xl font-semibold">
          고양이 눈 사진
        </div>

        {/* 제목 + 상태 */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-900">{result.catName} 진단결과</h2>
          <span className="text-blue-600 bg-blue-100 text-sm px-3 py-1 rounded-full">{result.status}</span>
        </div>

        {/* 진단 일시 */}
        <p className="text-sm text-gray-500 mb-6">
          진단 일시<br />{result.date}
        </p>

        {/* AI 분석 결과 박스 */}
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Image src="/images/robot-icon.png" alt="AI" width={20} height={20} />
            <span className="font-semibold text-sm text-gray-800">AI 분석 결과</span>
          </div>
          <p className="text-sm text-gray-600">수의사 AI의 진단 의견입니다.</p>
          <p className="mt-2 text-sm text-gray-800">{result.analysis}</p>
        </div>
      </div>
    </div>
  )
}

export default function DiagnosisResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiagnosisResultContent />
    </Suspense>
  );
}
