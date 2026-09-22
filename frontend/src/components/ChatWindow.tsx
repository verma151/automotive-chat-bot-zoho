import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";
import ChatInput from "./ChatInput";
import type { ChatMessage } from "../types/chat";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (message: string) => void;
}

export default function ChatWindow({
  messages,
  loading,
  onSend,
}: Props) {
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 && (
          <div className="welcome">
            <h2>Welcome to AutoAssist 👋</h2>

            <p>
              I can help you with vehicles, test drives,
              bookings and service requests.
            </p>

            <div className="suggestions">
              <button
                onClick={() =>
                  onSend(
                    "Tell me about the Thar variants and pricing"
                  )
                }
              >
                🚙 Thar pricing
              </button>

              <button
                onClick={() =>
                  onSend(
                    "Check my test drive status. My phone number is 9876543210"
                  )
                }
              >
                📅 Test drive status
              </button>

              <button
                onClick={() =>
                  onSend(
                    "Check my booking status. My booking ID is MAH-9921"
                  )
                }
              >
                📦 Booking status
              </button>

              <button
                onClick={() =>
                  onSend(
                    "I want to report a service issue with my vehicle"
                  )
                }
              >
                🔧 Service
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {loading && <LoadingIndicator />}
      </div>

      <ChatInput
        onSend={onSend}
        disabled={loading}
      />
    </div>
  );
}