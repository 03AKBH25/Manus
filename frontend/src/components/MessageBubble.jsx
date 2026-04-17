import { BrainCircuit } from "lucide-react";

const formatTimestamp = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const trimMemory = (memory) => {
  const text = memory?.content || memory?.text || "";
  return text.length > 100 ? `${text.slice(0, 97)}...` : text;
};

function MessageBubble({ message, activeAvatar }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`message-row ${isAssistant ? "assistant" : "user"}`}>
      <div className="message-meta">
        <span>{isAssistant ? activeAvatar?.name || "Avatar" : "You"}</span>
        <span>{formatTimestamp(message.createdAt)}</span>
      </div>
      <div className={`message-card ${isAssistant ? "assistant" : "user"}`}>
        {message.content}
      </div>

      {isAssistant && message.memories?.length ? (
        <div className="memory-stack">
          <div className="memory-label">
            <BrainCircuit size={13} />
            <span>Memory recall</span>
          </div>
          <div className="memory-list">
            {message.memories.slice(0, 2).map((memory, index) => (
              <span key={`${message.id}-memory-${index}`} className="memory-chip">
                {trimMemory(memory)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MessageBubble;
