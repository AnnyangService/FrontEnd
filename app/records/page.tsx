import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"

export default function RecordsPage() {
  return (
    <div className="pb-16 flex flex-col min-h-screen bg-white">
      <Header title="기록" showSettings />

      <div className="p-4 space-y-8">

        {/* 고양이 눈 질병 기록 */}
        <section>
          <h2 className="text-lg font-bold mb-4">고양이 눈 질병 기록</h2>

          <div className="space-y-4">
            <Link href="/diagnosis/result/1" className="block border rounded-lg p-4 shadow-sm hover:bg-gray-50">
              <div className="flex gap-4">
                <Image
                  src="/images/cat-closeup.png"
                  alt="고양이 눈"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">눈 결막염 진단</p>
                  <p className="text-sm text-gray-600">2025.02.15</p>
                  <p className="text-sm text-gray-600 mt-1">눈물이 많이 나고 충혈이 심함</p>
                </div>
              </div>
              <div className="text-blue-500 mt-3 text-center border-t pt-2 text-sm">상세보기</div>
            </Link>

            <Link href="/diagnosis/result/2" className="block border rounded-lg p-4 shadow-sm hover:bg-gray-50">
              <div className="flex gap-4">
                <Image
                  src="/images/cat-nabi.png"
                  alt="고양이"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">정기 검진</p>
                  <p className="text-sm text-gray-600">2025.02.10</p>
                  <p className="text-sm text-gray-600 mt-1">양호 / 특이사항 없음</p>
                </div>
              </div>
              <div className="text-blue-500 mt-3 text-center border-t pt-2 text-sm">상세보기</div>
            </Link>
          </div>
        </section>

        {/* AI 상담 기록 */}
        <section>
          <h2 className="text-lg font-bold mb-4">AI 상담 기록</h2>

          <div className="space-y-4">
            <Link href="/chat/result" className="block border rounded-lg p-4 shadow-sm hover:bg-gray-50">
              <div className="mb-2">
                <p className="font-medium text-gray-800">Q: 고양이 눈 건강 관리는 어떻게 해야 하나요?</p>
                <p className="text-sm text-gray-600 mt-1">A: 정기적인 청결 관리와 이상 증상 관찰이 중요합니다.</p>
              </div>
              <div className="text-blue-500 mt-3 text-center border-t pt-2 text-sm">상세보기</div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
