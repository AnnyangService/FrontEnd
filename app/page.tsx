"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Settings } from "lucide-react"

type RecentDiagnosis = {
  id: number;
  name: string;
  date: string;
  image: string;
};

type RecentChat = {
  id: number;
  title: string;
  date: string;
};

type RecentNotification = {
  id: number;
  title: string;
};

async function getRecentDiagnoses(): Promise<RecentDiagnosis[]> {
  return [
    {
      id: 1,
      name: '미오 진단결과',
      date: '2025.02.15',
      image: '/images/cat-mio.png',
    },
    {
      id: 2,
      name: '나비 진단결과',
      date: '2025.02.14',
      image: '/images/cat-nabi.png',
    },
  ];
}

async function getRecentChat(): Promise<RecentChat[]> {
  return [
    {
      id: 1,
      title: '최근 상담',
      date: '2025.02.15 14:30',
    },
  ];
}

async function getRecentNotification(): Promise<RecentNotification[]> {
  return [
    {
      id: 1,
      title: '새 진단 결과가 도착했습니다.',
    },
  ];
}

export default function HomePage() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [recentDiagnoses, setRecentDiagnoses] = useState<RecentDiagnosis[]>([])
  const [recentChat, setRecentChat] = useState<RecentChat[]>([])
  const [recentNotifications, setRecentNotifications] = useState<RecentNotification[]>([])
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    async function loadData() {
      const [diagnoses, chat, notifications] = await Promise.all([
        getRecentDiagnoses(),
        getRecentChat(),
        getRecentNotification()
      ])
      setRecentDiagnoses(diagnoses)
      setRecentChat(chat)
      setRecentNotifications(notifications)
    }
    loadData()
  }, [])

  if (!recentDiagnoses || !recentChat) return null

  return (
    <div className="pb-16 relative">
      <header className="flex items-center justify-end p-4">
        <div className="flex items-center gap-4 relative">
          {/* 종 버튼 */}
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="w-6 h-6" />
          </button>

          {/* 알림 박스 */}
          {showNotifications && (
            <div
              ref={notifRef}
              className="absolute top-8 right-0 w-64 bg-white border shadow-md rounded-md animate-fade-in z-50"
            >
              <div className="p-3 border-b font-medium text-sm">알림</div>
              <ul className="text-sm divide-y">
                {recentNotifications?.map((notification) => (
                  <li key={notification.id} className="p-3 hover:bg-gray-100">
                    {notification.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
            <div className="bg rounded-full p-2 mb-2">
              <Image src="/images/camera_vector.svg?height=30&width=30" alt="카메라" width={24} height={24} />
            </div>
            <span className="text-center">새로운 진단</span>
          </Link>
          <Link href="/chat" className="bg-green-500 text-white p-6 rounded-lg flex flex-col items-center">
            <div className="bg rounded-full p-2 mb-2">
              <Image src="images/chatting_vector.svg?height=30&width=30" alt="채팅" width={24} height={24} />
            </div>
            <span className="text-center">AI 챗봇</span>
          </Link>
        </div>

        <h2 className="text-xl font-bold mb-4">최근 진단 기록</h2>
        <div className="space-y-4">
          {recentDiagnoses.map((diagnosis) => (
            <Link href={`/diagnosis/result/${diagnosis.id}`} className="block border rounded-lg p-4">
              <div className="flex gap-4">
                <Image src={diagnosis.image} alt={diagnosis.name} width={80} height={80} className="rounded-lg object-cover" />
                <div>
                  <h3 className="font-medium">{diagnosis.name}</h3>
                  <p className="text-gray-500">{diagnosis.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">AI 상담 기록</h2>
        {recentChat.map((chat) => (
          <Link href={`/chat/history/${chat.id}`} className="block border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{chat.title}</h3>
                <p className="text-gray-500">{chat.date}</p>
              </div>
              <div className="text-gray-400">&gt;</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


