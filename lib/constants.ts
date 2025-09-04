const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  DIS_MODEL: `${API_BASE_URL}/auth/dismode`, //<<<질병진단모델 API 이거 나중에 변경 필요
  DIS_CATEGORY: (id:string) => `${API_BASE_URL}/auth/disease_category/${id}`, //<<<질병대분류 API 이거 나중에 변경 필요
  DIS_ATTRIBUTES: (id:string) => `${API_BASE_URL}/auth/disease_attributes/${id}`, //<<<세부질병 가져오는 API 이거 나중에 변경 필요
  DIS_DETAILED:`${API_BASE_URL}/auth/disease_specific`, //<<<세부질병질문에 대한 답변 API 이거 나중에 변경 필요
  CHAT_SESSIONS: `${API_BASE_URL}/chatbot/sessions`, //<<챗봇세션생성, 수정필요
  CHAT_CONVERSATIONS: (sessionId: string) => `${API_BASE_URL}/chatbot/sessions/${sessionId}/conversations`, // 대화 기록 조회 및 메시지 전송
  CHAT_HISTORY: (id: string) => `${API_BASE_URL}/v1/chatbot/${id}`, //<<챗봇기록가져오기, 수정필요
  CHAT_MESSAGE: `${API_BASE_URL}/v1/chatbot/message`, //챗봇 메시지 주고받기, 수정필요
} as const;


