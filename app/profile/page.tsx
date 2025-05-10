"use client"

import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MessageSquare } from "lucide-react"
import { UserInfo } from "@/lib/types/profile"
import { useEffect } from "react"
import { useState } from "react"
import { fetchApi } from "@/lib/fetch-api"
import { API_ENDPOINTS } from "@/lib/constants"
import { Cat } from "@/lib/types/cat"
import { formatBirthDateToKorean } from "@/lib/utils/date"

async function getUserInfo(id: string): Promise<UserInfo> {
  const catLists = await fetchApi<Cat[]>(API_ENDPOINTS.GET_CAT_LIST);
  return {
    name: "홍길동동",
    email: "kildong@email.com",
    recordCount: 12,
    chatCount: 8,
    cats: catLists.data,
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    async function loadUserInfo(id: string) {
      const data = await getUserInfo(id);
      setUserInfo(data);
    }
    loadUserInfo(user?.id || '');
  }, []);

  if (!userInfo) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="프로필" />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{userInfo.name}</h2>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
         <Link href="/records" className="flex-1 bg-blue-50 p-4 rounded-lg block">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">진단 기록</span>
            </div>
           <p className="text-2xl font-bold">{userInfo.recordCount}건</p>
         </Link>

          <Link href="/records" className="flex-1 bg-green-50 p-4 rounded-lg block">
           <div className="flex items-center gap-2 text-green-600 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">AI 상담</span>
           </div>
          <p className="text-2xl font-bold">{userInfo.chatCount}건</p>
          </Link>
        </div>


        <h3 className="text-lg font-bold mb-4">등록된 고양이</h3>
        <div className="space-y-4 mb-8">
          {userInfo.cats.map(cat => (
            <Link key={cat.id} href={`/cat?id=${cat.id}`} className="block border rounded-lg p-4">
              <div className="flex gap-4">
                <Image src={cat.image} alt={cat.name} width={80} height={80} className="rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold">{cat.name}</h4>
                  <p className="text-gray-500">{formatBirthDateToKorean(cat.birthDate)}</p>
                  <p className="text-gray-500">최근 진단: {cat.lastDiagnosis}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/cat/register" className="block bg-blue-100 text-blue-600 p-4 rounded-lg text-center mb-8">
          + 내 고양이 등록
        </Link>

        <h3 className="text-lg font-bold mb-4">내 활동</h3>
        <Link href="/records" className="block border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold">진단 기록</h4>
              <p className="text-gray-500">최근 진단 내역을 확인하세요</p>
            </div>
            <div className="text-gray-400">&gt;</div>
          </div>
        </Link>
        <Link href="/chat" className="block border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold">AI 상담</h4>
              <p className="text-gray-500">수의사 AI와 상담하세요</p>
            </div>
            <div className="text-gray-400">&gt;</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
