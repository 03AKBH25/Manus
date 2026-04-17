import AvatarPortrait from "./AvatarPortrait";

function AvatarSelector({
  avatars,
  selectedAvatarId,
  onSelect,
  onGenerateCurated,
  generatingCurated,
  insights,
  userId,
  userLabel
}) {
  const curatedAvatar = avatars.find((avatar) => avatar.type === "curated");
  const presetAvatars = avatars.filter((avatar) => avatar.type !== "curated");

  return (
    <aside className="glass-panel sidebar-panel">
      <div className="brand-pill">Curated AI Studio</div>

      <section className="hero-card">
        <p className="eyebrow">Modern AI Avatar Chatbot</p>
        <h1>Design-ready companions with memory, emotion, and presence.</h1>
        <p>
          Your backend already understands persona and emotional context. This
          new interface turns that into a premium avatar experience.
        </p>
        <div className="hero-metrics">
          <div>
            <strong>{avatars.length}</strong>
            <span>Avatar modes</span>
          </div>
          <div>
            <strong>{insights?.stats.memoryStrength ?? 0}%</strong>
            <span>Memory sync</span>
          </div>
        </div>
      </section>

      <section
        className={`curated-card ${
          selectedAvatarId === curatedAvatar?.id ? "selected" : ""
        }`}
      >
        <div className="section-heading">
          <h3>Curated AI Avatar</h3>
          <span>One click</span>
        </div>
        <p>
          Create a bespoke avatar based on past conversations, emotional
          patterns, and how the user naturally behaves in chat.
        </p>
        {curatedAvatar ? (
          <button
            type="button"
            className="curated-preview"
            onClick={() => onSelect(curatedAvatar.id)}
          >
            <AvatarPortrait avatar={curatedAvatar} size="md" />
            <div>
              <strong>{curatedAvatar.name}</strong>
              <span>{curatedAvatar.description}</span>
            </div>
          </button>
        ) : null}
        <button
          type="button"
          className="primary-action"
          onClick={onGenerateCurated}
          disabled={generatingCurated}
        >
          {generatingCurated
            ? "Generating your curated avatar..."
            : "Create / refresh curated avatar"}
        </button>
      </section>

      <div className="section-heading compact">
        <h3>Avatar lineup</h3>
        <span>{presetAvatars.length} live</span>
      </div>

      <div className="avatar-list">
        {presetAvatars.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            className={`avatar-card ${
              selectedAvatarId === avatar.id ? "selected" : ""
            }`}
            onClick={() => onSelect(avatar.id)}
          >
            <AvatarPortrait avatar={avatar} size="md" />
            <div className="avatar-copy">
              <div className="avatar-heading">
                <strong>{avatar.name}</strong>
                <span>{avatar.title}</span>
              </div>
              <p>{avatar.description}</p>
              <div className="tag-list">
                {avatar.badges?.map((badge) => (
                  <span key={badge} className="tag-chip">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="session-card">
        <span className="session-label">Active user</span>
        <strong>{userLabel || userId}</strong>
      </div>
    </aside>
  );
}

export default AvatarSelector;
