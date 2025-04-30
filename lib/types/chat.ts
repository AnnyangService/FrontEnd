export interface Message {
  text: string;
  from: 'user' | 'bot';
  image?: string;
}

export interface ChatHistory {
  id: string;
  mode: 'eye' | 'general';
  messages: Message[];
  date: string;
}
