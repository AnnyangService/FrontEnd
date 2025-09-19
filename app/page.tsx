"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Settings, Cat as CatIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Cat } from "@/lib/types/cat"; 
import { CatAPI } from "@/api/cat/cat.api"; 
import { useChatting } from "@/hooks/use-chatting";
import { formatBirthDateToKorean } from "@/lib/utils/date";



type RecentChat = {
  id: string;
  title: string;
  date: string;
};

type RecentNotification = {
  id: number;
  title: string;
};




async function getRecentNotification(): Promise<RecentNotification[]> {
  return [
    {
      id: 1,
      title: '새 진단 결과가 도착했습니다.',
    },
  ];
}

export default function HomePage() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [registeredCats, setRegisteredCats] = useState<Cat[]>([])
  const [recentChat, setRecentChat] = useState<RecentChat[]>([])
  const [recentNotifications, setRecentNotifications] = useState<RecentNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const notifRef = useRef<HTMLDivElement>(null)
  const { fetchChatList, fetchChatHistory } = useChatting();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

       const loadData = async () => {
      try {
        setIsLoading(true)
        // 1. 필요한 모든 데이터를 병렬로 가져옵니다.
        const [cats, sessionItems, notifications] = await Promise.all([ 
          CatAPI.getCatLists(),
          fetchChatList(),
          getRecentNotification()
        ])
        setRegisteredCats(cats) 
        setRecentNotifications(notifications)

        // 2. 최근 3개의 채팅 내역을 가공합니다.
        if (sessionItems && sessionItems.length > 0) {
          // sessionItems 배열에서 최신 3개만 잘라냅니다.
          const latestThreeSessions = sessionItems.slice(0, 3);

          // 3개의 세션을 병렬로 처리하여 데이터를 가져옵니다.
          const recentChatsPromises = latestThreeSessions.map(async (session) => {
            const history = await fetchChatHistory(session.session_id);

            if (history && history.length > 0) {
              let title = '';
              // 두 번째 질문이 있으면 제목으로, 없으면 첫 번째 질문을 제목으로 사용합니다.
              if (history.length > 1 && history[1]) {
                title = history[1].question;
              } else {
                title = history[0].question;
              }

              // 제목이 너무 길면 잘라줍니다.
              if (title.length > 20) {
                title = title.substring(0, 20) + "...";
              }

              const date = new Date(session.created_at).toLocaleString('ko-KR');

              return { id: session.session_id, title, date };
            }
            return null; // 기록이 없는 경우 null을 반환합니다.
          });
          
          // 모든 작업이 완료될 때까지 기다리고, null이 아닌 유효한 데이터만 저장합니다.
          const resolvedRecentChats = (await Promise.all(recentChatsPromises))
            .filter((chat): chat is RecentChat => chat !== null);

          setRecentChat(resolvedRecentChats);

        } else {
          setRecentChat([]);
        }

      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    loadData()
  }, [fetchChatList, fetchChatHistory])

  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>
  }

   if (!registeredCats.length && !recentChat.length && !recentNotifications.length) { 
    return <div className="p-4">데이터가 없습니다.</div>
  }

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

        <h2 className="text-xl font-bold mb-4">등록된 고양이</h2> 
      <div className="space-y-4">
        {registeredCats.map((cat) => ( 
          <Link 
            key={cat.id} 
            href={`/cat?id=${cat.id}`}  
            className="block border rounded-lg p-4"
          >
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
                    <CatIcon className="w-10 h-10 text-gray-400" /> {/* CatIcon 사용 */}
                </div>
              )}
              <div>
                <h3 className="font-medium">{cat.name}</h3> 
                <p className="text-gray-500 text-sm">
                  {cat.birthDate ? `${formatBirthDateToKorean(cat.birthDate)}` : '생일 정보 없음'}
                </p>
                <p className="text-gray-500 text-sm">
                  최근 진단일: {cat.lastDiagnosis || '기록 없음'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

        <h2 className="text-xl font-bold mt-8 mb-4">AI 상담 기록</h2>
        <div className="space-y-4"> 
        {recentChat.map((chat) => (
          <Link 
            key={chat.id}
            href={`/chat/result?id=${chat.id}`} 
            className="block border rounded-lg p-4"
          >
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
    </div>
  )
}


