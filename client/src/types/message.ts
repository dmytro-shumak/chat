export interface Message {
  username: string;
  text: string;
  color: string;
  avatar: string;
  timestamp: string;
}

export interface LoadMessagesResponse {
  messages: Message[];
  lastUserMessageTime?: string;
}
