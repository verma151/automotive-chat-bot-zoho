import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import StageBadge from "./components/StageBadge";
import { useChat } from "./hooks/useChat";

function App() {
  const {
    messages,
    loading,
    sendUserMessage,
    clearChat,
  } = useChat();

  return (
    <div className="app">
      <Header onClear={clearChat} />

      <main>
        <StageBadge stage="AI Automotive Assistant" />

        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={sendUserMessage}
        />
      </main>
    </div>
  );
}

export default App;