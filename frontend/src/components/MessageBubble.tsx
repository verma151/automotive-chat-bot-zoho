import type { ChatMessage } from "../types/chat";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-row ${
        isUser ? "message-user" : "message-assistant"
      }`}
    >
      <div className="message-bubble">
        {message.content}
      </div>
    </div>
  );
}