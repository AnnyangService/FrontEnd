"use client";

import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MessageSquare, UserCircle, Cat as CatIcon } from "lucide-react";
import { UserInfo } from "@/lib/types/profile";
import { useEffect, useState } from "react";
import { formatBirthDateToKorean } from "@/lib/utils/date";
import { AuthAPI } from "@/api/auth/auth.api";
import { CatAPI } from "@/api/cat/cat.api";
import api from "@/api/api"; 
import { API_ENDPOINTS } from "@/lib/constants"; 
import { ChatSessionItem } from "@/hooks/use-chatting"; 
import { ApiResponse } from "@/api/api.types"; 

async function getUserInfo(): Promise<UserInfo> {
  // 1. 유저 정보 불러오기
  const userData = await AuthAPI.me();
  
  // 2. 고양이 리스트 불러오기
  const catLists = await CatAPI.getCatLists();

  const response = await api.get<ApiResponse<{ sessions: ChatSessionItem[] }>>(
    API_ENDPOINTS.CHAT_SESSIONS_LIST
  );

  const chatSessions = response.data.data.sessions || [];

  // 3. 예시로 count는 고정값, 나중에 필요하면 API 연동
  return {
    name: userData.name,
    email: userData.email,
    recordCount: 12,
    chatCount: chatSessions.length,
    cats: catLists,
  };
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error("사용자 정보를 불러오는 데 실패했습니다", error);
      }
    };

    loadUserInfo();
  }, []);

  if (!userInfo) {
    return (
      <div className="p-4 text-center text-gray-500">
        🔄 사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="프로필" />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <UserCircle className="w-full h-full text-gray-400" />
      </div>
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
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[80px] h-[80px] rounded-lg bg-gray-100 flex items-center justify-center">
                      <CatIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}

                <div>
                  <h4 className="font-bold">{cat.name}</h4>
                  <p className="text-gray-500">{formatBirthDateToKorean(cat.birthDate)}</p>
                  <p className="text-gray-500">최근 진단: {cat.lastDiagnosis}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/cat/register"
          className="block bg-blue-100 text-blue-600 p-4 rounded-lg text-center mb-8"
        >
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
