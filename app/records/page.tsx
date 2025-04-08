import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"

export default function RecordsPage() {
  return (
    <div className="pb-16">
      <Header title="기록" showSettings />

      <div className="p-4">
        <div className="mb-8">
          <div className="mb-2">
            <p className="text-gray-500">2025.02.15</p>
            <h2 className="text-xl font-bold">눈 결막염 진단</h2>
          </div>

          <Link href="/diagnosis/result/1" className="block border rounded-lg p-4">
            <div className="flex gap-4">
              <Image
                src="/images/cat-closeup.png"
                alt="고양이 눈"
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
              <div>
                <p className="text-gray-700">증상: 눈물이 많이 나고 충혈이 심함</p>
                <p className="text-gray-700 mt-1">진단: 결막염 초기 증상</p>
              </div>
            </div>
            <div className="block text-center text-blue-500 mt-4 py-2 border-t">
              상세보기
            </div>
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-2">
            <p className="text-gray-500">2025.02.10</p>
            <h2 className="text-xl font-bold">정기 검진</h2>
          </div>

          <Link href="/diagnosis/result/2" className="block border rounded-lg p-4">
            <div className="flex gap-4">
              <Image
                src="/images/cat-nabi.png"
                alt="나비"
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
              <div>
                <p className="text-gray-700">상태: 양호</p>
                <p className="text-gray-700 mt-1">특이사항 없음</p>
              </div>
            </div>
            <div className="block text-center text-blue-500 mt-4 py-2 border-t">
              상세보기
            </div>
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-2">
            <p className="text-gray-500">2025.02.14</p>
            <h2 className="text-xl font-bold">AI 상담</h2>
          </div>

          <Link href="/chat/history/1" className="block border rounded-lg p-4">
            <div>
              <p className="font-medium">Q: 고양이 눈 건강 관리는 어떻게 해야 하나요?</p>
              <p className="text-gray-600 mt-2">A: 정기적인 청결 관리와 이상 증상 관찰이 중요합니다.</p>
            </div>
            <div className="block text-center text-blue-500 mt-4 py-2 border-t">
              상세보기
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
