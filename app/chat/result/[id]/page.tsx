"use client"

import { use, useEffect, useState } from "react"
import Header from "@/components/header"
import Image from "next/image"
import { ChatHistory } from "@/lib/types/chat"

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

export default function ChatHistoryDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const [chat, setChat] = useState<ChatHistory | null>(null);

  useEffect(() => {
    async function loadChat() {
      const data = await getChatHistory(id);
      setChat(data);
    }
    loadChat();
  }, [id]);

  if (!chat) return null;

  const theme = chat.mode === "eye"
    ? { bubble: "bg-blue-100", myMsg: "bg-blue-500 text-white", badge: "bg-blue-100 text-blue-700" }
    : { bubble: "bg-green-100", myMsg: "bg-green-500 text-white", badge: "bg-green-100 text-green-700" };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <Header title="상담 기록" backUrl="/chat" />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme.badge}`}>
            {chat.mode === "eye" ? "눈 건강" : "일반 상담"}
          </span>
          <span className="text-gray-500 text-sm">{chat.date}</span>
        </div>

        <div className="space-y-4">
          {chat.messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.from === "user" ? `${theme.myMsg} ml-auto` : theme.bubble
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 