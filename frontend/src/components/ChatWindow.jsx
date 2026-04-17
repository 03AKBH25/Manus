import { useEffect, useRef } from "react";
import { Loader2, Sparkles, SendHorizontal } from "lucide-react";
import AvatarPortrait from "./AvatarPortrait";
import MessageBubble from "./MessageBubble";

function ChatWindow({
  activeAvatar,
  messages,
  loading,
  historyLoading,
  onSendMessage,
  inputValue,
  setInputValue,
  error,
  onSuggestionSelect
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, historyLoading]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (inputValue.trim() && !loading) {
      onSendMessage(inputValue);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <main className="glass-panel chat-panel">
      <header className="chat-header">
        {activeAvatar ? (
          <>
            <div className="chat-avatar-block">
              <AvatarPortrait avatar={activeAvatar} size="lg" />
              <div>
                <div className="eyebrow">Live avatar session</div>
                <h2>{activeAvatar.name}</h2>
                <p>{activeAvatar.title}</p>
              </div>
            </div>
            <div className="status-pill">
              <span className="status-dot" />
              Memory-aware and ready
            </div>
          </>
        ) : null}
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

      <section ref={scrollRef} className="chat-scroll">
        {historyLoading ? (
          <div className="empty-state">
            <Loader2 size={22} className="spin" />
            <p>Loading conversation history...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              activeAvatar={activeAvatar}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-visual">
              <Sparkles size={24} />
            </div>
            <h3>Modern avatar chat workspace</h3>
            <p>
              This conversation will adapt to saved persona, emotional context,
              and recalled memory whenever it is relevant.
            </p>
            <div className="suggestion-row centered">
              {activeAvatar?.starterPrompts?.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => onSuggestionSelect(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="typing-indicator">
            <Loader2 size={14} className="spin" />
            <span>{activeAvatar?.name || "Avatar"} is composing a reply...</span>
          </div>
        ) : null}
      </section>

      <div className="composer-shell">
        <div className="suggestion-row">
          {activeAvatar?.starterPrompts?.slice(0, 3).map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="suggestion-chip"
              onClick={() => onSuggestionSelect(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeAvatar
                ? `Message ${activeAvatar.name} with full persona and memory context...`
                : "Select an avatar to begin"
            }
            disabled={!activeAvatar || loading}
            rows={1}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!activeAvatar || loading || !inputValue.trim()}
            aria-label="Send message"
          >
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}

export default ChatWindow;
