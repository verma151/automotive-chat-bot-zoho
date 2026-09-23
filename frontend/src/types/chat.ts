export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  stage?: string | null;
}