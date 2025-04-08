import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"

export default function DiagnosisResultPage({ params }: { params: { id: string } }) {
  return (
    <div className="pb-16">
      <Header title="진단 결과" backUrl="/" showMoreOptions />

      <div className="p-4">
        <div className="mb-4">
          <Image
            src="/images/cat-mio.png"
            alt="고양이 사진"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">미오 진단결과</h2>
            <p className="text-gray-500">2025.02.15 15:30</p>
          </div>
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full">정상</button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-green-100 rounded-full p-2">
              <Image src="/images/robot-icon.png" alt="AI" width={32} height={32} />
            </div>
            <div>
              <h3 className="font-medium">AI 분석 결과</h3>
              <p className="text-gray-500 text-sm">수의사 AI의 진단 의견입니다</p>
            </div>
          </div>

          <p className="mt-4">
            고양이의 눈 상태는 전반적으로 양호해 보입니다. 동공 반응이 정상이며, 결막도 건강한 상태입니다.
          </p>

          <p className="mt-4">특별한 염증이나 감염의 징후는 보이지 않으며, 눈물량도 적절한 수준을 유지하고 있습니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/diagnosis/new"
            className="bg-blue-500 text-white py-4 rounded-lg flex justify-center items-center"
          >
            <Image src="/placeholder.svg?height=24&width=24" alt="카메라" width={24} height={24} className="mr-2" />
            <span>새로운 진단</span>
          </Link>
          <Link href="/chat" className="bg-green-500 text-white py-4 rounded-lg flex justify-center items-center">
            <Image src="/placeholder.svg?height=24&width=24" alt="채팅" width={24} height={24} className="mr-2" />
            <span>AI 챗봇</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

