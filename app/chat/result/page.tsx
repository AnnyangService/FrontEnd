"use client"

import Header from "@/components/header"
import Image from "next/image"
import { ChatHistory } from "@/lib/types/chat"
import { useEffect, useState } from "react";

async function getChatHistory(id: string): Promise<ChatHistory> {
  return {
    id,
    mode: "eye",
    messages: [
      { text: "고양이가 눈을 자주 깜빡여요.", from: "user" },
      { text: "눈을 자주 깜빡이는 경우 결막염, 알레르기, 이물질 등이 원인일 수 있어요.", from: "bot" },
      { text: "눈곱이 많이 껴요.", from: "user" },
      { text: "충혈, 눈곱이 있다면 병원 진료를 추천드립니다.", from: "bot" },
    ],
    date: "2025.02.15 14:30"
  };
}

export default function ChatHistoryDetailPage({ params }: { params: { id: string } }) {
  const [chat, setChat] = useState<ChatHistory | null>(null);

  useEffect(() => {
    async function loadChat() {
      const data = await getChatHistory('1');
      setChat(data);
    }
    loadChat();
  }, ['1']);

  if (!chat) return null;
  
  const theme = chat.mode === "eye"
    ? { bubble: "bg-blue-100", myMsg: "bg-blue-500 text-white", badge: "bg-blue-100 text-blue-700" }
    : { bubble: "bg-green-100", myMsg: "bg-green-500 text-white", badge: "bg-green-100 text-green-700" }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="상담 기록" backUrl="/records" />

      <div className="px-4 py-2 border-b">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${theme.badge}`}>
          {chat.mode === "eye" ? "👁️ 눈 상담" : "🩺 일반 상담"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.from === "user" ? "flex justify-end" : "flex items-start gap-2"}
          >
            {msg.from === "bot" && (
              <Image
                src="/images/robot-icon.png"
                alt="AI"
                width={36}
                height={36}
                className="rounded-full"
              />
            )}
            <div className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap ${msg.from === "user" ? theme.myMsg : theme.bubble}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
