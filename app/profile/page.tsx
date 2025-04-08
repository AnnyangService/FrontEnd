import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MessageSquare } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="pb-16">
      <Header title="내 정보" showSettings />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-8">
          <Image src="/images/profile-image.png" alt="프로필" width={80} height={80} className="rounded-full" />
          <div>
            <h2 className="text-xl font-bold">홍길동동</h2>
            <p className="text-gray-500">kildong@email.com</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-4">등록된 고양이</h3>
        <div className="space-y-4 mb-8">
          <Link href="/cat/1" className="block border rounded-lg p-4">
            <div className="flex gap-4">
              <Image src="/images/cat-mio.png" alt="미오" width={80} height={80} className="rounded-lg object-cover" />
              <div>
                <h4 className="font-bold">미오</h4>
                <p className="text-gray-500">2023년 3월 15일생</p>
                <p className="text-gray-500">최근 진단: 2025.02.15</p>
              </div>
            </div>
          </Link>

          <Link href="/cat/2" className="block border rounded-lg p-4">
            <div className="flex gap-4">
              <Image src="/images/cat-nabi.png" alt="나비" width={80} height={80} className="rounded-lg object-cover" />
              <div>
                <h4 className="font-bold">나비</h4>
                <p className="text-gray-500">2022년 8월 10일생</p>
                <p className="text-gray-500">최근 진단: 2025.02.14</p>
              </div>
            </div>
          </Link>
        </div>

        <Link href="/cat/register" className="block bg-blue-100 text-blue-600 p-4 rounded-lg text-center mb-8">
          + 내 고양이 등록
        </Link>

        <h3 className="text-lg font-bold mb-4">내 활동</h3>
        <div className="space-y-4">
          <Link href="/records" className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              <span>진단 기록</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">12회</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          </Link>

          <Link href="/chat/history" className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              <span>AI 상담 기록</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">8회</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

