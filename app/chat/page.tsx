"use client"
/*
그냥 들어오면 -> 새로운 채팅 POST요청, 채팅생성
sesseion id같이 들어오면 -> 채팅 목록 가져와서 나열, 채팅시작
메시지값 들어오면 -> 가져온 메시지값으로 채팅 세션 시작

*/

import { useState, useRef, useEffect, Suspense, useCallback } from "react"
import Image from "next/image"
import { Copy, RefreshCw, MoreHorizontal, Loader2, Send } from "lucide-react" 
import { useChatting, ChatHistoryItem } from "@/hooks/use-chatting"
import { Message } from "@/lib/types/chat" 
import { useSearchParams, useRouter } from "next/navigation"

export type ChatInfo = {
  id: string 
  name: string
  mode: "eye" | "general"
}

// 채팅 목록 
export async function getChatList(): Promise<ChatInfo[]> {
  return [
    { id: "session_id_1", name: "첫번째 눈 상담", mode: "eye" },
    { id: "session_id_2", name: "일반 질문", mode: "general" },
    { id: "session_id_3", name: "눈 질병 관련 문의", mode: "eye" }
  ]
}


const BOTTOM_NAVIGATION_HEIGHT = 56;
const CHAT_INPUT_AREA_HEIGHT = 68; 


function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSessionIdFromUrl = searchParams.get('session_id');

  const {
    sessionId: currentSessionId,
    isCreatingSession,
    createSessionError,
    createChatSession,
    isFetchingHistory,
    fetchHistoryError,
    fetchChatHistory,
    isSendingMessage,
    sendMessageError,
    sendMessage,
    setSessionId: setCurrentSessionIdInHook,
  } = useChatting();

  const [currentChatMode, setCurrentChatMode] = useState<"eye" | "general">("eye"); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [renamingIndex, setRenamingIndex] = useState<number | null>(null);
  const [newChatName, setNewChatName] = useState("");
  
  const [chatList, setChatList] = useState<ChatInfo[]>([]);
  const [currentChatName, setCurrentChatName] = useState<string>("새로운 채팅");
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const theme = currentChatMode === "eye"
    ? { bg: "bg-white", bubble: "bg-blue-100", myMsg: "bg-blue-500" }
    : { bg: "bg-white", bubble: "bg-green-100", myMsg: "bg-green-500" };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    setIsLoadingPage(true);
    async function initializeChat() {
      const loadedChatList = await getChatList();
      setChatList(loadedChatList);

      //URL에있는 초기메시지 가져옴
      const initialMessage = searchParams.get('initialMessage')
      
      let activeChatInfo = null;
      if (initialSessionIdFromUrl) {
        activeChatInfo = loadedChatList.find(chat => chat.id === initialSessionIdFromUrl);
      }

      if (initialSessionIdFromUrl && activeChatInfo) {
        setCurrentSessionIdInHook(initialSessionIdFromUrl);
        setCurrentChatName(activeChatInfo.name);
        setCurrentChatMode(activeChatInfo.mode);

        const historyItems = await fetchChatHistory(initialSessionIdFromUrl);
        if (historyItems) {
          const formattedMessages: Message[] = historyItems.reduce((acc, item) => {
            acc.push({ text: item.question, from: "user", typing: false });
            acc.push({ text: item.answer, from: "bot", documentation: item.document, typing: false });
            return acc;
          }, [] as Message[]);
          setMessages(formattedMessages);
        } else {
          setMessages([]);
          console.error("Failed to fetch chat history:", fetchHistoryError);
        }
      } else {
        setMessages([]);
        const defaultNewChatMode: "eye" | "general" = "eye"; 
        setCurrentChatMode(defaultNewChatMode);
        setCurrentChatName("새로운 채팅");

        //채팅세션 시작
        const contextForNewChat = initialMessage || ""
        const newSessionId = await createChatSession(contextForNewChat);
        if (newSessionId) {
          router.replace(`/chat?session_id=${newSessionId}`, { scroll: false });
          setChatList(prev => [{id: newSessionId, name: "새로운 채팅", mode: defaultNewChatMode}, ...prev]);
          setCurrentSessionIdInHook(newSessionId);
        } else {
          console.error("Failed to create new chat session:", createSessionError);
        }
      }
      setIsLoadingPage(false);
    }
    initializeChat();
  }, [initialSessionIdFromUrl]); 

  const handleSelectChat = (chat: ChatInfo) => {
    setMenuOpen(false);
    if (currentSessionId !== chat.id) {
      router.push(`/chat?session_id=${chat.id}`);
    }
  };

  const applyRename = () => {
    if (renamingIndex === null || !newChatName.trim() || !chatList[renamingIndex]) return;
    const targetChat = chatList[renamingIndex];
    console.log(`Renaming chat ID ${targetChat.id} to ${newChatName.trim()}`);
    
    setChatList(prev =>
      prev.map((chat, idx) =>
        idx === renamingIndex ? { ...chat, name: newChatName.trim() } : chat
      )
    );
    if (currentSessionId === targetChat.id) {
        setCurrentChatName(newChatName.trim());
    }
    setRenamingIndex(null);
    setActiveMenuIndex(null);
  };

  const handleDeleteChat = (chatIdToDelete: string, index: number) => {
    console.log(`Deleting chat ID ${chatIdToDelete}`);
    setChatList(prev => prev.filter((_, idx) => idx !== index));
    setActiveMenuIndex(null);
    if (currentSessionId === chatIdToDelete) {
        router.replace('/chat'); 
    }
  }

  const handleSend = async () => {
    if (input.trim() === "" || !currentSessionId || isSendingMessage) {
        if (!currentSessionId) alert("채팅 세션 정보를 불러오고 있습니다. 잠시 후 다시 시도해주세요.");
        return;
    }
  
    const userMessage: Message = { text: input, from: "user", typing: false };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    setMessages(prev => [...prev, { text: "", from: "bot", typing: true }]);
    
    const aiResponse = await sendMessage(currentInput, currentSessionId);

    setMessages(prev => prev.filter(msg => !(msg.typing === true) )); 

    if (aiResponse) {
      setMessages(prev => [...prev, { text: aiResponse.answer, from: "bot", documentation: aiResponse.documentation, typing: false }]);
    } else {
      setMessages(prev => [...prev, { text: "죄송합니다, 답변을 가져오는데 실패했습니다.", from: "bot", typing: false }]);
      console.error("Failed to send message or get AI response:", sendMessageError);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("복사되었습니다!");
  }
  
  const handleNewChat = () => {
    setMenuOpen(false);
    router.push('/chat'); 
  };

  if (isLoadingPage || isCreatingSession || (initialSessionIdFromUrl && isFetchingHistory)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen"> {/* 로딩 시 전체 화면 사용 */}
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="mt-3 text-lg text-gray-600">
          {isCreatingSession ? "새로운 채팅방을 만들고 있어요..." : "채팅 내용을 불러오는 중..."}
        </p>
      </div>
    );
  }

  return (
   
    <div 
        className={`flex flex-col flex-1 ${theme.bg} transition-colors duration-300 relative overflow-hidden`}
        style={{ paddingBottom: `${BOTTOM_NAVIGATION_HEIGHT}px` }} 
    >
      {/* 사이드 메뉴 오버레이 */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20" 
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-full w-2/3 max-w-xs bg-white shadow-lg z-30 transform transition-transform duration-300 flex flex-col ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b font-semibold text-lg flex justify-between items-center">
            채팅 목록
            <button 
                onClick={handleNewChat}
                className="text-blue-500 hover:text-blue-700 text-2xl font-semibold"
                title="새 채팅 시작"
            >
                ＋
            </button>
        </div>
        <div className="p-2 space-y-1 overflow-y-auto flex-1">
        {chatList.map((chat, idx) => (
            <div
                key={chat.id || idx}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center justify-between p-3 text-base rounded-md transition-colors duration-200 cursor-pointer relative group ${
                currentSessionId === chat.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
            >
                <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis pr-2">
                {renamingIndex === idx ? (
                    <input
                    type="text"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    onBlur={applyRename}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyRename())}
                    autoFocus
                    className="border-b border-gray-400 focus:outline-none px-1 py-0.5 w-full text-sm bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span title={chat.name}>{chat.name}</span>
                )}
                </div>
                <button
                    className="p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActiveMenuIndex(activeMenuIndex === idx ? null : idx);
                        setMenuPosition({ top: rect.top + rect.height / 2, left: rect.left - 130 }); 
                    }}
                >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
                {activeMenuIndex === idx && menuPosition && (
                    <div
                        className="fixed z-[60] w-32 bg-white border rounded shadow-lg menu-popup"
                        style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        transform: "translateY(-50%)", 
                        }}
                        ref={dropdownRef}
                    >
                        <button
                        onClick={(e) => { e.stopPropagation(); setRenamingIndex(idx); setNewChatName(chat.name); setActiveMenuIndex(null);}}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                        이름 변경
                        </button>
                        <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id, idx);}}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600"
                        >
                        삭제
                        </button>
                    </div>
                )}
            </div>    
        ))}
        </div>
      </div>

     
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white relative z-10 shrink-0"> {/* z-index 낮춤 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-700 hover:text-black focus:outline-none"
            aria-label="메뉴 열기/닫기"
          >
            &#9776;
          </button>
          <div className="text-lg font-semibold text-gray-900 truncate max-w-[calc(100vw-180px)]" title={currentChatName}>
            {currentChatName}
          </div>
        </div>
        <div className={`text-sm border px-2 py-1 rounded-md ${
            currentChatMode === "eye" 
            ? "text-blue-700 border-blue-200 bg-blue-50" 
            : "text-green-700 border-green-200 bg-green-50"
        }`}>
            {currentChatMode === "eye" ? "👀 눈 상담" : "🩺 일반 상담"}
        </div>
      </div>

     
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4"> 
        {messages.map((msg, idx) => (
          <ChatBubble
            key={idx}
            text={msg.text}
            from={msg.from}
            theme={theme}
            typing={msg.typing}  
            documentation={msg.documentation}
            onCopy={msg.from === "bot" && !msg.typing && msg.text ? () => handleCopy(msg.text) : undefined}
            onRegenerate={msg.from === "bot" && !msg.typing && msg.text ? () => alert("API 연동 후 응답 재생성 구현") : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 bg-white z-10 shrink-0"> 
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 resize-none overflow-y-auto max-h-32 text-sm leading-snug focus:ring-1 focus:ring-blue-500 focus:border-blue-500 no-scrollbar"
            rows={1}
          />
          <button 
            className="p-2 self-center text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            onClick={handleSend} 
            disabled={isSendingMessage || input.trim() === ""}
            title="전송"
          >
            {isSendingMessage ? 
                <Loader2 className="w-5 h-5 animate-spin" /> : 
                <Send className="w-5 h-5" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({
  text, from, theme, onCopy, onRegenerate, typing, documentation
}: {
  text: React.ReactNode
  from: "bot" | "user"
  theme: any
  onCopy?: () => void
  onRegenerate?: () => void
  typing?: boolean
  documentation?: string | null;
}) {
  const showActions = from === "bot" && !typing && text;
  return (
    <div className={`flex w-full ${from === "bot" ? "justify-start" : "justify-end"}`}>
        <div className={`flex gap-2 items-end ${from === "bot" ? "flex-row" : "flex-row-reverse"}`}>
            {from === "bot" && (
                <Image src="/images/robot-icon.png" alt="AI" width={32} height={32} className="rounded-full self-start shrink-0" />
            )}
            <div className={`p-3 rounded-lg max-w-[85%] break-words shadow-sm text-sm leading-relaxed ${
                from === "bot" 
                ? `${theme.bubble} text-gray-800` 
                : `${theme.myMsg} text-white`
            }`}>
                
                {typing ? (
                <div className="flex items-center gap-1.5 py-1 px-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                ) : (
                <>
                    <p className="whitespace-pre-wrap">{text}</p>
                    {documentation && (
                        <div className="mt-2 pt-2 border-t border-gray-300/50">
                            <p className="text-xs text-gray-500 mb-0.5">참고 자료:</p>
                            <a href={documentation} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline break-all">
                                {documentation}
                            </a>
                        </div>
                    )}
                </>
                )}

                {showActions && (
                    <div className={`flex gap-1 mt-1.5 ${from === "bot" ? "justify-start" : "justify-end"}`}>
                    {onCopy && (
                        <button onClick={onCopy} className="p-1 rounded hover:bg-black/10 transition-colors" title="복사">
                        <Copy className={`w-3.5 h-3.5 ${from === "bot" ? "text-gray-500 hover:text-gray-700" : "text-gray-200 hover:text-white"}`} />
                        </button>
                    )}
                    {onRegenerate && (
                        <button onClick={onRegenerate} className="p-1 rounded hover:bg-black/10 transition-colors" title="재생성">
                        <RefreshCw className={`w-3.5 h-3.5 ${from === "bot" ? "text-gray-500 hover:text-gray-700" : "text-gray-200 hover:text-white"}`} />
                        </button>
                    )}
                    </div>
                )}
            </div>
      </div>
    </div>
  )
}

export default function ChatPageWithSuspense() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="mt-3 text-lg text-gray-600">채팅 페이지를 불러오는 중...</p>
            </div>
        }>
            <ChatPageContent />
        </Suspense>
    )
}