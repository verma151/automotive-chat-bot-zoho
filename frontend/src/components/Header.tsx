interface Props {
  onClear: () => void;
}

export default function Header({ onClear }: Props) {
  return (
    <header className="header">
      <div>
        <h1>AutoAssist AI</h1>
        <p>Automotive Customer Assistant</p>
      </div>

      <button onClick={onClear}>
        New Conversation
      </button>
    </header>
  );
}