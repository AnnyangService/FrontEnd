export interface Message {
  text: string;
  from: 'user' | 'bot';
  image?: string | null;       //나중에 채팅에서 이미지 사용 안하면 그냥 빼기기
  typing?: boolean;          //Ai답변 로딩중일때 표시하려고 사용용
  documentation?: string | null;      //일단 따로 빼두고 나중에 봐서 그냥 메시지에 포함시키거나 하면 될듯?
}

export interface ChatHistory {
  id: string;
  mode: 'eye' | 'general';
  messages: Message[];
  date: string;
}
