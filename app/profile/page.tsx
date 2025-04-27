"use client"

import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"

interface CatInfo {
  id: number;
  name: string;
  birthDate: string;
  recentDiagnosis: string;
  image: string;
}

interface UserInfo {
  name: string;
  email: string;
  recordCount: number;
  chatCount: number;
  cats: CatInfo[];
}

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)

  //로그인 테스트. 밑에줄 주석처리하면 로그인 해달라고 변경
  useEffect(() => {
    setIsLoggedIn(true)
    setUser({
      name: "홍길동동",
      email: "kildong@email.com",
      recordCount: 12,
      chatCount: 8,
      cats: [
        {
          id: 1,
          name: "미오",
          birthDate: "2023년 3월 15일생",
          recentDiagnosis: "2025.02.15",
          image: "/images/cat-mio.png"
        },
        {
          id: 2,
          name: "나비",
          birthDate: "2022년 8월 10일생",
          recentDiagnosis: "2025.02.14",
          image: "/images/cat-nabi.png"
        }
      ]
    })
  }, [])

  return (
    <div className="pb-16">
      <Header title="내 정보" showSettings />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-8">
          {isLoggedIn && user ? (
            <>
              <Image src="/images/profile-image.png" alt="프로필" width={80} height={80} className="rounded-full" />
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <p className="text-gray-500 mb-4">로그인 해주세요</p>
              <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                로그인 하러 가기
              </Link>
            </div>
          )}
        </div>

        {isLoggedIn && user && (
          <>
            <h3 className="text-lg font-bold mb-4">등록된 고양이</h3>
            <div className="space-y-4 mb-8">
              {user.cats.map(cat => (
                <Link key={cat.id} href={`/cat/${cat.id}`} className="block border rounded-lg p-4">
                  <div className="flex gap-4">
                    <Image src={cat.image} alt={cat.name} width={80} height={80} className="rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold">{cat.name}</h4>
                      <p className="text-gray-500">{cat.birthDate}</p>
                      <p className="text-gray-500">최근 진단: {cat.recentDiagnosis}</p>
                    </div>
                  </div>
                </Link>
              ))}
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
                  <span className="text-gray-500 mr-2">{user.recordCount}회</span>
                  <span className="text-gray-400">&gt;</span>
                </div>
              </Link>

              <Link href="/chat/history" className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  <span>AI 상담 기록</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">{user.chatCount}회</span>
                  <span className="text-gray-400">&gt;</span>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
