import type { ChatRequest, ChatResponse } from "../types/chat";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function sendMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("payload",payload)
  console.log("response",response)

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}