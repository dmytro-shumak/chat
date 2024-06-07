export interface Message {
  username: string;
  text: string;
  color: string;
  timestamp: string;
}

export interface LoadMessagesResponse {
  messages: Message[];
  lastUserMessageTime?: string;
}
