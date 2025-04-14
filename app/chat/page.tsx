"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MessagesSquare, Copy, RefreshCw } from "lucide-react"

export default function ChatPage() {
  const [mode, setMode] = useState<"eye" | "general">("eye")
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; from: "user" | "bot" }[]>([])
  const [input, setInput] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const theme = mode === "eye"
    ? { bg: "bg-white", bubble: "bg-blue-100", myMsg: "bg-blue-500", text: "text-blue-800" }
    : { bg: "bg-white", bubble: "bg-green-100", myMsg: "bg-green-500", text: "text-green-800" }

  const chatList = ["가나다라마바사", "고양이대한질문", "고양이눈질병"]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSend = () => {
    if (input.trim() === "") return
    setMessages((prev) => [...prev, { text: input, from: "user" }])
    setInput("")
    if (inputRef.current) inputRef.current.style.height = "auto"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={`flex flex-col h-screen ${theme.bg} transition-colors duration-300 relative`}>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-2/3 max-w-xs bg-white shadow-lg z-30 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b font-semibold">채팅 목록</div>
        <div className="p-4 space-y-3 overflow-y-auto max-h-full">
          {chatList.map((chat, index) => (
            <div
              key={index}
              className="py-4 text-lg text-center rounded-md bg-white text-gray-900 transition-colors duration-200 hover:bg-black hover:text-white cursor-pointer"
            >
              {chat}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-b bg-white relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700 hover:text-black">
            &#9776;
          </button>
          <div className="text-lg font-semibold text-gray-900">채팅 이름</div>
        </div>
        <div className="flex items-center gap-2" ref={dropdownRef}>
          <button className="p-2 text-gray-600 hover:text-black">
            <MessagesSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 transition"
          >
            {mode === "eye" ? "👁️ 눈 상담" : "🩺 일반 상담"}
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>
          {dropdownOpen && (
    <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded shadow z-50">
      <button
        onClick={() => setDropdownOpen(false)} // mode 변경 없음
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        👁️ 눈 상담
      </button>
      <button
        onClick={() => setDropdownOpen(false)} // mode 변경 없음
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        🩺 일반 상담
      </button>
    </div>
  )}
        </div>
      </div>

    


      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[120px]">
        {messages.map((msg, idx) => (
          <ChatBubble
            key={idx}
            text={msg.text}
            from={msg.from}
            theme={theme}
            onCopy={() => handleCopy(msg.text)}
            onRegenerate={msg.from === "user" ? () => alert("응답 재생성") : undefined}
          />
        ))}
      </div>

      <div className="border-t p-2 bg-white sticky bottom-[56px] z-10">
        <div className="flex items-start gap-2">
          <button className="p-2">
            <Image src="/images/gallery-image.png?height=24&width=24" alt="이미지 첨부" width={24} height={24} />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-full px-4 py-2 resize-none overflow-hidden max-h-40"
            rows={1}
          />
          <button className="p-2" onClick={handleSend}>
            <Image src="/images/airplane-image.png?height=24&width=24" alt="전송" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ text, from, theme, onCopy, onRegenerate }: {
  text: React.ReactNode;
  from: "bot" | "user";
  theme: any;
  onCopy?: () => void;
  onRegenerate?: () => void;
}) {
  return (
    <div className={from === "bot" ? "flex items-start gap-2" : "flex justify-end"}>
      {from === "bot" && (
        <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />
      )}
      <div className={`${from === "bot" ? theme.bubble : theme.myMsg} ${from === "bot" ? "text-black" : "text-white"} p-3 rounded-lg max-w-[80%] break-words`}>
        <p>{text}</p>
        <div className="flex justify-end gap-2 mt-2 text-sm text-white">
          {onCopy && (
            <button onClick={onCopy} className="hover:text-black" title='복사'>
              <Copy className="w-4 h-4 inline" /> 
            </button>
          )}
          {onRegenerate && (
            <button onClick={onRegenerate} className="hover:text-black" title='재생성'>
              <RefreshCw className="w-4 h-4 inline" /> 
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
