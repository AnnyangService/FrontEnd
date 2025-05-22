import { useState, useCallback, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/constants'; 


/*챗봇 API */

// 2-1. 챗봇 세션 생성 API
interface CreateSessionRequestBody {
  context: string;
}
interface CreateSessionResponse {
  session_id: string;
}

// 2-2. 채팅 기록 받아오기 API
export interface ChatHistoryItem {
  createdAt: string;
  question: string;
  answer: string;
  document?: string | null;
}
interface GetHistoryResponse {
  history: ChatHistoryItem[];
}

// 2-3. 챗봇 메시지 전송 API
interface SendMessageRequestBody {
  session_id: string;
  question: string;
}
// 질문 대한 API 응답
export interface SendMessageResponse { 
  answer: string;
  documentation?: string | null;
}

export function useChatting(initialContext: string = "") {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [createSessionError, setCreateSessionError] = useState<string | null>(null);

  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [fetchHistoryError, setFetchHistoryError] = useState<string | null>(null);

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendMessageError, setSendMessageError] = useState<string | null>(null);

  // 2-1. 챗봇 세션 생성
  const createChatSession = useCallback(async (context: string = initialContext): Promise<string | null> => {
    setIsCreatingSession(true);
    setCreateSessionError(null);
    setSessionId(null);

    try {
      const requestBody: CreateSessionRequestBody = { context };
      if (!API_ENDPOINTS.CHAT_SESSION) {
        console.error("API_ENDPOINTS.CHAT_SESSION이 정의되지 않았습니다.");
        setCreateSessionError("API 엔드포인트 설정 오류입니다.");
        setIsCreatingSession(false);
        return null;
      }

      const response = await fetch(API_ENDPOINTS.CHAT_SESSION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: CreateSessionResponse | { message?: string, error?: {message?: string} } = await response.json();

      if (!response.ok) {
        const errorMsg = (data as any)?.message || (data as any)?.error?.message || '챗봇 세션 생성에 실패했습니다.';
        throw new Error(errorMsg);
      }

      const newSessionId = (data as CreateSessionResponse).session_id;
      setSessionId(newSessionId);
      return newSessionId;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '챗봇 세션 생성 중 알 수 없는 오류 발생';
      setCreateSessionError(errorMessage);
      console.error("Error creating chat session:", err);
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, [initialContext]);

  // 2-2. 기록 받아오기
  const fetchChatHistory = useCallback(async (currentSessionId: string): Promise<ChatHistoryItem[] | null> => {
    if (!currentSessionId) {
      setFetchHistoryError("세션 ID가 없어 기록을 가져올 수 없습니다.");
      return null;
    }
    setIsFetchingHistory(true);
    setFetchHistoryError(null);

    try {
      if (typeof API_ENDPOINTS.CHAT_HISTORY !== 'function') {
        console.error("API_ENDPOINTS.CHAT_HISTORY가 함수 형태로 정의되지 않았습니다.");
        setFetchHistoryError("API 엔드포인트 설정 오류입니다.");
        setIsFetchingHistory(false);
        return null;
      }

      const response = await fetch(API_ENDPOINTS.CHAT_HISTORY(currentSessionId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: GetHistoryResponse | { message?: string, error?: {message?: string} } = await response.json();

      if (!response.ok) {
        const errorMsg = (data as any)?.message || (data as any)?.error?.message || '채팅 기록을 불러오는데 실패했습니다.';
        throw new Error(errorMsg);
      }
      
      return (data as GetHistoryResponse).history || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '채팅 기록 로딩 중 알 수 없는 오류 발생';
      setFetchHistoryError(errorMessage);
      console.error("Error fetching chat history:", err);
      return null;
    } finally {
      setIsFetchingHistory(false);
    }
  }, []);

  // 2-3. 챗봇 메시지 전송 및 답변 받기 - API 응답(SendMessageResponse) 또는 null 반환
  const sendMessage = useCallback(async (question: string, currentSessionId: string): Promise<SendMessageResponse | null> => {
    if (!currentSessionId) {
      setSendMessageError("세션 ID가 없어 메시지를 전송할 수 없습니다.");
      return null;
    }
    if (!question.trim()) {
      return null;
    }

    setIsSendingMessage(true);
    setSendMessageError(null);

    try {
      const requestBody: SendMessageRequestBody = {
        session_id: currentSessionId,
        question,
      };

      if (!API_ENDPOINTS.CHAT_MESSAGE) {
        console.error("API_ENDPOINTS.CHAT_MESSAGE가 정의되지 않았습니다.");
        setSendMessageError("API 엔드포인트 설정 오류입니다.");
        setIsSendingMessage(false);
        return null; 
      }
      
      //토큰가져오는거 틀리면 수정해야함함
      const token = localStorage.getItem('authToken');
      if (!token) {
        setSendMessageError("인증 토큰이 없습니다. 로그인이 필요합니다.");
        setIsSendingMessage(false);
        return null;
      }

        //일단 이런식으로 하고 오류나면 바꾸기
      const response = await fetch(API_ENDPOINTS.CHAT_MESSAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      const data: SendMessageResponse | { message?: string, error?: {message?: string} } = await response.json();

      if (!response.ok) {
        const errorMsg = (data as any)?.message || (data as any)?.error?.message || '메시지 전송에 실패했습니다.';
        setSendMessageError(errorMsg);

        return null;
      }

      return data as SendMessageResponse; 

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '메시지 전송/응답 처리 중 알 수 없는 오류 발생';
      setSendMessageError(errorMessage);
      console.error("Error sending message or processing response:", err);
      return null;
    } finally {
      setIsSendingMessage(false);
    }
  }, []);

  return {
    sessionId, 
    isCreatingSession,
    createSessionError,
    createChatSession,  
    isFetchingHistory,
    fetchHistoryError,
    fetchChatHistory,
    isSendingMessage,
    sendMessageError,
    sendMessage,
    setSessionId, 
  };
}