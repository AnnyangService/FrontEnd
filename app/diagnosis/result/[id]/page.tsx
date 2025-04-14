import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"

export default function DiagnosisResultPage({ params }: { params: { id: string } }) {
  return (
    <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col pb-16">
      <Header title="상세" backUrl="/" />

      <div className="p-4 flex-1">
        {/* 이미지 영역 */}
        <div className="mb-6 w-full h-[240px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-2xl font-bold">
          390 × 240
        </div>

        {/* 제목 + 상태 */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">미오 진단결과</h2>
          <span className="text-blue-600 bg-blue-100 text-sm px-3 py-1 rounded-full">정상</span>
        </div>

        {/* 진단 일시 */}
        <p className="text-gray-500 mb-6">
          진단 일시<br />2025.02.15 15:30
        </p>

        {/* AI 분석 결과 박스 */}
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/images/robot-icon.png" alt="AI" width={20} height={20} />
            <span className="font-semibold text-sm">AI 분석 결과</span>
          </div>
          <p className="text-sm text-gray-700">수의사 AI의 진단 의견입니다</p>
          <p className="mt-2 text-sm">결막염 초기증세가 의심됩니다</p>
        </div>

        {/* 하단 버튼들 생략됨 (이미지 기준엔 없음) */}
      </div>
    </main>
  )
}
