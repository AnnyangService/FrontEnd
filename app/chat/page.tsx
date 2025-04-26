"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MessagesSquare, Copy, RefreshCw } from "lucide-react"

interface Message {
  text: string
  from: "user" | "bot"
  image?: string
}

export default function ChatPage() {
  const [mode, setMode] = useState<"eye" | "general">("eye")
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  /*const handleSend = () => {
    if (input.trim() === "" && !selectedImage) return
    setMessages(prev => [
      ...prev,
      { text: input, from: "user", image: previewUrl }
    ])
    setInput("")
    setSelectedImage(null)
    setPreviewUrl("")
    if (inputRef.current) inputRef.current.style.height = "auto"
  }*/

    const handleSend = () => {
      if (input.trim() === "" && !selectedImage) return
    
      // 1. 사용자 메시지 추가
      setMessages(prev => [
        ...prev,
        { text: input, from: "user", image: previewUrl }
      ])
    
      // 2. 봇 타이핑 표시 추가
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: "", from: "bot", typing: true }
        ])
      }, 300) // 0.3초 후에 "typing" 표시 추가
    
      // 3. 봇 실제 답변 추가
      setTimeout(() => {
        setMessages(prev => [
          ...prev.slice(0, -1), // typing 메시지 지우고
          { text: "ai답변이런식으로 나옵니다.", from: "bot" }
        ])
      }, 1800) // typing 후 시간지나면 추가
    
      // 4. 입력창 초기화
      setInput("")
      setSelectedImage(null)
      setPreviewUrl("")
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
      {/* 숨은 파일 입력 */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* 메뉴 오버레이 */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-full w-2/3 max-w-xs bg-white shadow-lg z-30 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b font-semibold">채팅 목록</div>
        <div className="p-4 space-y-3 overflow-y-auto max-h-full">
          {chatList.map((chat, idx) => (
            <div
              key={idx}
              className="py-4 text-lg text-center rounded-md bg-white text-gray-900 transition-colors duration-200 hover:bg-black hover:text-white cursor-pointer"
            >
              {chat}
            </div>
          ))}
        </div>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-700 hover:text-black"
          >
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
              <button onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 hover:bg-gray-100">👁️ 눈 상담</button>
              <button onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 hover:bg-gray-100">🩺 일반 상담</button>
            </div>
          )}
        </div>
      </div>

      {/* 이미지 미리보기 */}
      {previewUrl && (
        <div className="absolute bottom-[120px] left-4 z-30">
          <img src={previewUrl} alt="preview" className="w-16 h-16 object-cover rounded-lg border" />
        </div>
      )}

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[120px]">
        {messages.map((msg, idx) => (
          <ChatBubble
          key={idx}
          text={msg.text}
          from={msg.from}
          theme={theme}
          image={msg.image}
          typing={(msg as any).typing}  // ✅ typing 전달
          onCopy={() => handleCopy(msg.text)}
          onRegenerate={msg.from === "user" ? () => alert("응답 재생성") : undefined}
        />
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-2 bg-white sticky bottom-[56px] z-10">
        <div className="flex items-start gap-2">
          <button className="p-2" onClick={handleAttachClick}><Image src="/images/gallery-image.png?height=24&width=24" alt="이미지 첨부" width={24} height={24} /></button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="메시지를 입력하세요"
            className="flex-1 border rounded-full px-4 py-2 resize-none overflow-hidden max-h-40"
            rows={1}
          />
          <button className="p-2" onClick={handleSend}><Image src="/images/airplane-image.png?height=24&width=24" alt="전송" width={24} height={24} /></button>
        </div>
      </div>
    </div>
  )
}

/*function ChatBubble({ text, from, theme, onCopy, onRegenerate, image }: { text: React.ReactNode; from: "bot" | "user"; theme: any; onCopy?: () => void; onRegenerate?: () => void; image?: string }) {
  return (
    <div className={from === "bot" ? "flex items-start gap-2" : "flex justify-end"}>
      {from === "bot" && <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />}
      <div className={`${from === "bot" ? theme.bubble : theme.myMsg} ${from === "bot" ? "text-black" : "text-white"} p-3 rounded-lg max-w-[80%] break-words`}>        
        {image && <img src={image} alt="attachment" className="w-32 h-32 object-cover rounded-lg mb-2" />}
        <p>{text}</p>
        <div className="flex justify-end gap-2 mt-2 text-sm text-white">{onCopy && <button onClick={onCopy} className="hover:text-black" title="복사"><Copy className="w-4 h-4 inline" /></button>}{onRegenerate && <button onClick={onRegenerate} className="hover:text-black" title="재생성"><RefreshCw className="w-4 h-4 inline" /></button>}</div>
      </div>
    </div>
  )
}*/

function ChatBubble({ text, from, theme, onCopy, onRegenerate, image, typing }: {
  text: React.ReactNode;
  from: "bot" | "user";
  theme: any;
  onCopy?: () => void;
  onRegenerate?: () => void;
  image?: string;
  typing?: boolean;
}) {
  return (
    <div className={from === "bot" ? "flex items-start gap-2" : "flex justify-end"}>
      {from === "bot" && <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />}
      <div className={`${from === "bot" ? theme.bubble : theme.myMsg} ${from === "bot" ? "text-black" : "text-white"} p-3 rounded-lg max-w-[80%] break-words`}>
        
        {typing ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
          </div>
        ) : (
          <>
            {image && <img src={image} alt="attachment" className="w-32 h-32 object-cover rounded-lg mb-2" />}
            <p>{text}</p>
          </>
        )}

        <div className="flex justify-end gap-2 mt-2 text-sm text-white">
          {onCopy && <button onClick={onCopy} className="hover:text-black" title="복사"><Copy className="w-4 h-4 inline" /></button>}
          {onRegenerate && <button onClick={onRegenerate} className="hover:text-black" title="재생성"><RefreshCw className="w-4 h-4 inline" /></button>}
        </div>
      </div>
    </div>
  )
}
