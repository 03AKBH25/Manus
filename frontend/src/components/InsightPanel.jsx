const formatRelativeDate = (value) => {
  if (!value) {
    return "No prior chats yet";
  }

  const date = new Date(value);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

function InsightPanel({ insights, activeAvatar }) {
  if (!insights) {
    return (
      <aside className="glass-panel insight-panel">
        <div className="section-label">Memory Pulse</div>
        <h2>Building your profile...</h2>
      </aside>
    );
  }

  return (
    <aside className="glass-panel insight-panel">
      <div className="section-label">Memory Pulse</div>
      <h2>User Resonance</h2>
      <p className="panel-copy">{insights.personaSummary}</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{insights.stats.memoryStrength}%</span>
          <span className="stat-label">Memory strength</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{insights.stats.totalChats}</span>
          <span className="stat-label">Past chats</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{insights.stats.activeAvatars}</span>
          <span className="stat-label">Avatar modes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{insights.behavior.questionRatio}%</span>
          <span className="stat-label">Question-driven</span>
        </div>
      </div>

      <section className="insight-section">
        <div className="section-heading">
          <h3>Emotional pattern</h3>
          <span>{insights.dominantEmotion}</span>
        </div>
        <div className="signal-list">
          {insights.emotionalSignals.map((signal) => (
            <div key={signal.label} className="signal-row">
              <div className="signal-meta">
                <span>{signal.label}</span>
                <span>{signal.score}%</span>
              </div>
              <div className="signal-track">
                <span style={{ width: `${signal.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="insight-section">
        <div className="section-heading">
          <h3>Behavioral cues</h3>
          <span>{insights.behavior.avgWords} avg words</span>
        </div>
        <div className="detail-stack">
          {insights.behavior.traits.map((trait) => (
            <div key={trait} className="detail-card">
              {trait}
            </div>
          ))}
        </div>
      </section>

      <section className="insight-section">
        <div className="section-heading">
          <h3>Recurring themes</h3>
        </div>
        <div className="tag-list">
          {insights.topThemes.length > 0 ? (
            insights.topThemes.map((theme) => (
              <span key={theme} className="tag-chip">
                {theme}
              </span>
            ))
          ) : (
            <span className="tag-chip muted">New profile</span>
          )}
        </div>
      </section>

      <section className="insight-section">
        <div className="section-heading">
          <h3>Recent context</h3>
          <span>{formatRelativeDate(insights.stats.lastConversationAt)}</span>
        </div>
        <div className="highlight-list">
          {insights.recentHighlights.length > 0 ? (
            insights.recentHighlights.map((highlight) => (
              <div key={highlight.id} className="highlight-card">
                <strong>{highlight.avatarName}</strong>
                <p>{highlight.preview}</p>
              </div>
            ))
          ) : (
            <div className="highlight-card">
              <strong>Fresh start</strong>
              <p>Start chatting to let the curated avatar learn your rhythm.</p>
            </div>
          )}
        </div>
      </section>

      {activeAvatar?.type === "curated" ? (
        <div className="curated-note">
          The curated avatar is active and will keep adapting as new conversations are saved.
        </div>
      ) : null}
    </aside>
  );
}

export default InsightPanel;
