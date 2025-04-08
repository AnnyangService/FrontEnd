"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "@/components/header"

export default function ChatPage() {
  const [mode, setMode] = useState<"eye" | "general">("eye")

  // 색상 테마 정의
  const theme = mode === "eye"
    ? { bg: "bg-blue-100", bubble: "bg-blue-100", myMsg: "bg-blue-500", text: "text-blue-800" }
    : { bg: "bg-green-100", bubble: "bg-green-100", myMsg: "bg-green-500", text: "text-green-800" }

  return (
    <div className={`pb-16 flex flex-col h-screen ${theme.bg} transition-colors duration-300`}>
      <Header title="고양이 건강 AI 상담" backUrl="/" />

      {/* 모드 선택 버튼 */}
      <div className="bg-white p-2">
        <div className="flex justify-around">
          <button
            onClick={() => setMode("eye")}
            className={`${mode === "eye" ? `${theme.bg} ${theme.text}` : "bg-white text-gray-800"} px-4 py-2 rounded-lg flex-1 mx-1 transition-all duration-200`}
          >
            고양이 눈 질병 상담
          </button>
          <button
            onClick={() => setMode("general")}
            className={`${mode === "general" ? `${theme.bg} ${theme.text}` : "bg-white text-gray-800"} px-4 py-2 rounded-lg flex-1 mx-1 transition-all duration-200`}
          >
            일반 질병 상담
          </button>
        </div>
      </div>

      {/* 채팅 내용 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mode === "eye" ? (
          <>
            {/* 고양이 눈 상담 모드 */}
            <div className="flex items-start gap-2">
              <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />
              <div className={`${theme.bubble} p-3 rounded-lg max-w-[80%]`}>
                <p>안녕하세요! 고양이 눈 건강에 대해 어떤 것이 궁금하신가요?</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className={`${theme.myMsg} text-white p-3 rounded-lg max-w-[80%]`}>
                <p>우리 고양이가 눈을 자주 깜빡이는데 무슨 문제가 있을까요?</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />
              <div className={`${theme.bubble} p-3 rounded-lg max-w-[80%]`}>
                <p>고양이가 눈을 자주 깜빡이는 원인은 다음과 같아요:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>결막염</li>
                  <li>알레르기</li>
                  <li>이물질</li>
                  <li>각막 손상</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 일반 질병 상담 모드 */}
            <div className="flex items-start gap-2">
              <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />
              <div className={`${theme.bubble} p-3 rounded-lg max-w-[80%]`}>
                <p>안녕하세요! 고양이 건강 전반에 대해 궁금한 것을 물어보세요.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className={`${theme.myMsg} text-white p-3 rounded-lg max-w-[80%]`}>
                <p>고양이가 밥을 잘 안 먹어요. 왜 그럴까요?</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />
              <div className={`${theme.bubble} p-3 rounded-lg max-w-[80%]`}>
                <p>식욕 부진은 다음과 같은 이유일 수 있습니다:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>스트레스</li>
                  <li>소화기 질환</li>
                  <li>기생충 감염</li>
                  <li>구강 문제</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 입력창 */}
      <div className="border-t p-2 bg-white">
        <div className="flex items-center">
          <button className="p-2">
            <Image src="/placeholder.svg?height=24&width=24" alt="이미지 첨부" width={24} height={24} />
          </button>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-full px-4 py-2 mx-2"
          />
          <button className="p-2">
            <Image src="/placeholder.svg?height=24&width=24" alt="전송" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
