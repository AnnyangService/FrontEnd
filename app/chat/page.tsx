"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MessagesSquare, Copy, RefreshCw, MoreHorizontal } from "lucide-react"

interface Message {
  text: string
  from: "user" | "bot"
  images?: string[]
  typing?: boolean
}

export default function ChatPage() {
  const [mode, setMode] = useState<"eye" | "general">("eye")
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const [renamingIndex, setRenamingIndex] = useState<number | null>(null);
  const [newChatName, setNewChatName] = useState("");
  const [activeChatIndex, setActiveChatIndex] = useState(0);



  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const theme = mode === "eye"
    ? { bg: "bg-white", bubble: "bg-blue-100", myMsg: "bg-blue-500", text: "text-blue-800" }
    : { bg: "bg-white", bubble: "bg-green-100", myMsg: "bg-green-500", text: "text-green-800" }

    const [chatList, setChatList] = useState([
      { name: "가나다라마바사", mode: "eye" },
      { name: "고양이대한질문", mode: "general" },
      { name: "고양이눈질병", mode: "eye" },
    ]);
    
    
    const active_chatname = chatList[activeChatIndex]?.name; //현재 채팅 일단 임의로 설정

   

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }

      // 메뉴가 열려있고 클릭한 곳이 메뉴가 아닐 때
      const menuElements = document.querySelectorAll(".menu-popup")
    const isInMenu = Array.from(menuElements).some(el =>
      el.contains(event.target as Node)
    )

    if (!isInMenu) {
      setActiveMenuIndex(null)
    }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
  
    const fileArray = Array.from(files)

    if(fileArray.length >5){
      alert("최대 5개의 이미지만 첨부할 수 있습니다.")
      return
    }

    const urls = fileArray.map(file => URL.createObjectURL(file))
  
    setSelectedImages(fileArray)
    setPreviewUrls(urls)
  }

  const handleRemoveImage = (idx: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== idx))
    setSelectedImages(prev => prev.filter((_, i) => i !== idx))
  }

   //채팅 이름변경
  const applyRename = () => {
    if (renamingIndex === null || !newChatName.trim()) return;
    setChatList(prev =>
      prev.map((chat, idx) =>
        idx === renamingIndex ? { ...chat, name: newChatName.trim() } : chat
      )
    );
    setRenamingIndex(null);
  };
  

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
      if (input.trim() === "" && previewUrls.length === 0) return
    
      setMessages(prev => [
        ...prev,
        { text: input, from: "user", images: previewUrls },  // ✅ 한 메시지에 이미지들 포함
      ])
    
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: "", from: "bot", typing: true }
        ])
      }, 300)
    
      setTimeout(() => {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: "ai답변이런식으로 나옵니다.", from: "bot" }
        ])
      }, 1800)
    
      setInput("")
      setSelectedImages([])
      setPreviewUrls([])
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
        multiple
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
    className={`flex items-center justify-between px-3 py-4 text-lg rounded-md transition-colors duration-200 cursor-pointer relative ${
      activeChatIndex === idx ? "bg-gray-200" : "bg-white hover:bg-gray-100"
    }`}
  >
    <div className="flex-1">
      {renamingIndex === idx ? (
        <input
          type="text"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          onBlur={applyRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              applyRename()
            }
          }}
          autoFocus
          className="border-b border-gray-400 focus:outline-none px-1 py-0.5 w-full text-base"
        />
      ) : (
        <span>{chat.name}</span>
      )}
    </div>
    <button
      className="p-1 hover:bg-gray-100 rounded"
      onClick={(e) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        setActiveMenuIndex(activeMenuIndex === idx ? null : idx)
        setMenuPosition({ top: rect.top + rect.height / 2, left: rect.right + 8 })
      }}
    >
      <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            {activeMenuIndex === idx && menuPosition && (
  <div
    className="fixed z-50 w-32 bg-white border rounded shadow menu-popup"
    style={{
      top: `${menuPosition.top}px`,
      left: `${menuPosition.left}px`,
      transform: "translateY(-50%)", // 버튼 가운데 정렬
    }}
  >
    <button
      onClick={() => {
        setRenamingIndex(idx)
        setNewChatName(chat.name)
        setActiveMenuIndex(null)

      }}
      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
    >
      이름 변경
    </button>
    <button
      onClick={() => {
        alert("삭제");
        setActiveMenuIndex(null)
      }}
      className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
    >
      삭제
    </button>
  </div>
)}

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
          <div className="text-lg font-semibold text-gray-900">{active_chatname}</div>
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
      {previewUrls.length > 0 && (
  <div className="fixed bottom-32 md:bottom-40 left-4 w-fit z-20 flex gap-2 overflow-x-auto px-4">
    {previewUrls.map((url, idx) => (
      <div key={idx} className="relative w-16 h-16 shrink-0 overflow-visible">
        <img
          src={url}
          alt={`preview-${idx}`}
          className="w-16 h-16 object-cover rounded-lg border"
        />
        <button
          onClick={() => handleRemoveImage(idx)}
          className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
          title="삭제"
        >
          ×
        </button>
      </div>
    ))}
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
          images={(msg as any).images}
          typing={(msg as any).typing}  
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

function ChatBubble({
  text, from, theme, onCopy, onRegenerate, images, typing
}: {
  text: React.ReactNode
  from: "bot" | "user"
  theme: any
  onCopy?: () => void
  onRegenerate?: () => void
  images?: string[]
  typing?: boolean
}) {
  return (
    <div className={from === "bot" ? "flex items-start gap-2" : "flex justify-end"}>
      {from === "bot" && (
        <Image src="/images/robot-icon.png" alt="AI" width={40} height={40} className="rounded-full" />
      )}
      <div className={`${from === "bot" ? theme.bubble : theme.myMsg} ${from === "bot" ? "text-black" : "text-white"} p-3 rounded-lg max-w-[80%] break-words`}>
        
        {typing ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
          </div>
        ) : (
          <>
            {images && images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
                {images.map((img, idx) => (
                  <img key={idx} src={img} alt={`img-${idx}`} className="w-32 h-32 object-cover rounded-lg border shrink-0" />
                ))}
              </div>
            )}
            <p>{text}</p>
          </>
        )}

        <div className="flex justify-end gap-2 mt-2 text-sm text-white">
          {onCopy && (
            <button onClick={onCopy} className="hover:text-black" title="복사">
              <Copy className="w-4 h-4 inline" />
            </button>
          )}
          {onRegenerate && (
            <button onClick={onRegenerate} className="hover:text-black" title="재생성">
              <RefreshCw className="w-4 h-4 inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
