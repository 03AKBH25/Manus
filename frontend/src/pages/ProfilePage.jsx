import { useEffect, useState } from "react";
import { BrainCircuit, Loader2, UserRound } from "lucide-react";
import { fetchMyProfile, updateCurrentUser } from "../services/api";

function ProfilePage({ currentUser, onUserUpdate }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(currentUser?.name || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMyProfile();

        if (ignore) {
          return;
        }

        setProfile(data);
        setName(data.user.name || "");
      } catch (requestError) {
        if (!ignore) {
          console.error(requestError);
          setError("Unable to load the protected profile snapshot.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const user = await updateCurrentUser({ name });
      onUserUpdate(user);
      setProfile((current) =>
        current
          ? {
              ...current,
              user
            }
          : current
      );
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError?.response?.data?.error ||
          "Could not update your profile right now."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="profile-shell glass-panel profile-loading">
        <Loader2 size={24} className="spin" />
        <span>Loading your protected profile...</span>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="profile-shell glass-panel profile-loading">
        <span>{error || "Profile unavailable"}</span>
      </section>
    );
  }

  const { user, insights } = profile;

  return (
    <section className="profile-shell">
      <div className="glass-panel profile-card">
        <div className="section-label">Protected User Profile</div>
        <h2>What the AI understands about this user</h2>
        <p className="panel-copy">{insights.personaSummary}</p>

        <div className="profile-grid">
          <div className="stat-card">
            <span className="stat-value">{user.role}</span>
            <span className="stat-label">Role</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{insights.stats.memoryStrength}%</span>
            <span className="stat-label">Memory strength</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{insights.stats.totalChats}</span>
            <span className="stat-label">Saved chats</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{insights.dominantEmotion}</span>
            <span className="stat-label">Dominant emotion</span>
          </div>
        </div>
      </div>

      <div className="profile-grid-wide">
        <div className="glass-panel profile-card">
          <div className="section-heading">
            <h3>User account</h3>
            <span>JWT identity</span>
          </div>

          {error ? <div className="error-banner compact">{error}</div> : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your display name"
              />
            </label>

            <label>
              <span>Email</span>
              <input value={user.email || ""} disabled readOnly />
            </label>

            <button type="submit" className="primary-action" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Update profile"
              )}
            </button>
          </form>
        </div>

        <div className="glass-panel profile-card">
          <div className="section-heading">
            <h3>Behavioral portrait</h3>
            <span>AI-derived</span>
          </div>
          <div className="detail-stack">
            {insights.behavior.traits.map((trait) => (
              <div key={trait} className="detail-card profile-detail">
                <BrainCircuit size={16} />
                <span>{trait}</span>
              </div>
            ))}
          </div>

          <div className="section-heading compact">
            <h3>Recurring themes</h3>
            <span>{insights.topThemes.length} detected</span>
          </div>
          <div className="tag-list">
            {insights.topThemes.map((theme) => (
              <span key={theme} className="tag-chip">
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel profile-card">
          <div className="section-heading">
            <h3>Recent highlights</h3>
            <span>Conversation traces</span>
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
                <strong>No history yet</strong>
                <p>Start chatting so the AI can build a richer user portrait.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel profile-card">
          <div className="section-heading">
            <h3>Identity snapshot</h3>
            <span>Protected metadata</span>
          </div>
          <div className="detail-stack">
            <div className="detail-card profile-detail">
              <UserRound size={16} />
              <span>{user.name || currentUser?.name || "Unnamed user"}</span>
            </div>
            <div className="detail-card profile-detail">
              <span>Account created: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="detail-card profile-detail">
              <span>Last updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
