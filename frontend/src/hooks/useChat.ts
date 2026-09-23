import { useState } from "react";
import { sendMessage } from "../api/chatApi";
import type { ChatMessage } from "../types/chat";

const SESSION_STORAGE_KEY = "chat_session_id";

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<string | null>(null);

  const sessionId = getOrCreateSessionId();

  async function sendUserMessage(message: string) {
    if (!message.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await sendMessage({ sessionId, message });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (data.stage) setStage(data.stage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setStage(null);
    // Start a fresh backend conversation too, not just clear the UI
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  return { messages, loading, stage, sendUserMessage, clearChat };
}