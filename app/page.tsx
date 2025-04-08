import Link from "next/link"
import Image from "next/image"
import { Bell, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="pb-16">
      <header className="flex items-center justify-between p-4">
        <button className="p-2">
          <div className="w-6 h-1 bg-gray-700 mb-1"></div>
          <div className="w-6 h-1 bg-gray-700 mb-1"></div>
          <div className="w-6 h-1 bg-gray-700"></div>
        </button>
        <div className="flex items-center gap-4">
          <Link href="/notifications">
            <Bell className="w-6 h-6" />
          </Link>
          <Link href="/settings">
            <Settings className="w-6 h-6" />
          </Link>
          <Link href="/profile">
            <Image src="/images/profile-image.png" alt="프로필" width={24} height={24} className="rounded-full" />
          </Link>
        </div>
      </header>

      <div className="p-4">
        <h1 className="text-3xl font-bold mb-2">고양이 눈 진단</h1>
        <p className="text-gray-600 mb-8">AI로 간편하게 진단하세요</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/diagnosis/new" className="bg-blue-500 text-white p-6 rounded-lg flex flex-col items-center">
            <div className="bg-white rounded-full p-2 mb-2">
              <Image src="/placeholder.svg?height=24&width=24" alt="카메라" width={24} height={24} />
            </div>
            <span className="text-center">새로운 진단</span>
          </Link>
          <Link href="/chat" className="bg-green-500 text-white p-6 rounded-lg flex flex-col items-center">
            <div className="bg-white rounded-full p-2 mb-2">
              <Image src="/placeholder.svg?height=24&width=24" alt="채팅" width={24} height={24} />
            </div>
            <span className="text-center">AI 챗봇</span>
          </Link>
        </div>

        <h2 className="text-xl font-bold mb-4">최근 진단 기록</h2>
        <div className="space-y-4">
          <Link href="/diagnosis/result/1" className="block border rounded-lg p-4">
            <div className="flex gap-4">
              <Image src="/images/cat-mio.png" alt="미오" width={80} height={80} className="rounded-lg object-cover" />
              <div>
                <h3 className="font-medium">미오 진단결과</h3>
                <p className="text-gray-500">2025.02.15</p>
              </div>
            </div>
          </Link>
          <Link href="/diagnosis/result/2" className="block border rounded-lg p-4">
            <div className="flex gap-4">
              <Image src="/images/cat-nabi.png" alt="나비" width={80} height={80} className="rounded-lg object-cover" />
              <div>
                <h3 className="font-medium">나비 진단결과</h3>
                <p className="text-gray-500">2025.02.14</p>
              </div>
            </div>
          </Link>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">AI 상담 기록</h2>
        <Link href="/chat/history/1" className="block border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">최근 상담</h3>
              <p className="text-gray-500">2025.02.15 14:30</p>
            </div>
            <div className="text-gray-400">&gt;</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

