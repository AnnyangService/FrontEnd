import { useState, useCallback } from 'react';
import api from '@/api/api'; // api 인스턴스 사용
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse } from '@/api/api.types';


/* 챗봇 API */


// Swagger 기반 타입 정의
// 2-1. 챗봇 세션 생성 API 타입
interface CreateSessionRequestBody {
  query: string;
  diagnosis_id?: string; // diagnosis_id는 선택적으로 받을 수 있도록 수정
}
interface CreateSessionResponseData {
  session_id: string;
  first_conversation: {
    question: string;
    answer: string;
  };
}

export interface ChatSessionItem {
  session_id: string;
  is_diagnosis_based: boolean;
  created_at: string;
}
interface GetChatListResponseData {
  sessions: ChatSessionItem[];
}

// 2-2. 채팅 기록 받아오기 API 타입
export interface ChatHistoryItem {
  question: string;
  answer: string;
  createdAt: string;
}
interface GetHistoryResponseData {
  conversations: ChatHistoryItem[];
}


// 2-3. 챗봇 메시지 전송 API 타입
interface SendMessageRequestBody {
  query: string;
}
export interface SendMessageResponseData {
  answer: string;
}


export function useChatting() {
  const [sessionId, setSessionId] = useState<string | null>(null);


  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [createSessionError, setCreateSessionError] = useState<string | null>(null);


  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [fetchHistoryError, setFetchHistoryError] = useState<string | null>(null);


  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendMessageError, setSendMessageError] = useState<string | null>(null);

  const [isFetchingList, setIsFetchingList] = useState(false);
  const [fetchListError, setFetchListError] = useState<string | null>(null);


  // 2-1. 챗봇 세션 생성
  const createChatSession = useCallback(async (query: string, diagnosisId?: string): Promise<CreateSessionResponseData | null> => {
    setIsCreatingSession(true);
    setCreateSessionError(null);
    setSessionId(null);


    try {
      let response;
      
      // diagnosisId 유무에 따라 다른 API 엔드포인트와 요청 본문을 사용합니다.
      if (diagnosisId) {
        // 진단 ID가 있는 경우 (진단 기반 채팅)
        const requestBody = { query, diagnosis_id: diagnosisId };
        response = await api.post<ApiResponse<CreateSessionResponseData>>(API_ENDPOINTS.DIAG_CHAT_SESSIONS, requestBody);
      } else {
        // 진단 ID가 없는 경우 (일반 채팅)
        const requestBody = { query };
        response = await api.post<ApiResponse<CreateSessionResponseData>>(API_ENDPOINTS.NORMAL_CHAT_SESSIONS, requestBody);
      }

      if (!response.data.success) {
        throw new Error(response.data.error.message || '챗봇 세션 생성에 실패했습니다.');
      }

      const newSessionId = response.data.data.session_id;
      setSessionId(newSessionId);
      return response.data.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '챗봇 세션 생성 중 알 수 없는 오류 발생';
      setCreateSessionError(errorMessage);
      console.error("Error creating chat session:", err);
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, []);

  // 2-0. 챗봇 세션 목록 가져오기
  const fetchChatList = useCallback(async (): Promise<ChatSessionItem[] | null> => {
    setIsFetchingList(true);
    setFetchListError(null);

    try {
      const response = await api.get<ApiResponse<GetChatListResponseData>>(API_ENDPOINTS.CHAT_SESSIONS_LIST);

      if (!response.data.success) {
        throw new Error(response.data.error.message || '채팅 목록을 불러오는데 실패했습니다.');
      }

      return response.data.data.sessions || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '채팅 목록 로딩 중 알 수 없는 오류 발생';
      setFetchListError(errorMessage);
      console.error("Error fetching chat list:", err);
      return null;
    } finally {
      setIsFetchingList(false);
    }
  }, []);


  // 2-2. 기록 받아오기
  const fetchChatHistory = useCallback(async (currentSessionId: string): Promise<ChatHistoryItem[] | null> => {
    if (!currentSessionId) {
      setFetchHistoryError("세션 ID가 없어 기록을 가져올 수 없습니다.");
      return null;
    }
    setIsFetchingHistory(true);
    setFetchHistoryError(null);


    try {
      const response = await api.get<ApiResponse<GetHistoryResponseData>>(API_ENDPOINTS.CHAT_CONVERSATIONS(currentSessionId));
     
      if (!response.data.success) {
        throw new Error(response.data.error.message || '채팅 기록을 불러오는데 실패했습니다.');
      }
     
      return response.data.data.conversations || [];


    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '채팅 기록 로딩 중 알 수 없는 오류 발생';
      setFetchHistoryError(errorMessage);
      console.error("Error fetching chat history:", err);
      return null;
    } finally {
      setIsFetchingHistory(false);
    }
  }, []);


  // 2-3. 챗봇 메시지 전송 및 답변 받기
  const sendMessage = useCallback(async (question: string, currentSessionId: string): Promise<SendMessageResponseData | null> => {
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
        query: question,
      };


      const response = await api.post<ApiResponse<SendMessageResponseData>>(API_ENDPOINTS.CHAT_CONVERSATIONS(currentSessionId), requestBody);
     
      if (!response.data.success) {
        throw new Error(response.data.error.message || '메시지 전송에 실패했습니다.');
      }


      return response.data.data;


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
    isFetchingList,
    fetchListError,
    fetchChatList,
  };
}

