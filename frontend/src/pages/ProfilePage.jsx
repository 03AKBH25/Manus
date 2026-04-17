import { useEffect, useState } from "react";
import { BrainCircuit, Loader2, UserRound } from "lucide-react";
import { fetchMyProfile, updateCurrentUser } from "../services/api";

const formatConversationDate = (value) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
};

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
  const behavioralPortrait = insights.behavioralPortrait || {
    summary: "",
    traits: insights.behavior?.traits || [],
    conversationSignals: [],
    emotionalTraits: [],
    responsePreferences: [],
    recurringThemes: insights.topThemes || []
  };
  const recentInteractions = insights.recentInteractions || [];
  const portraitDetails = [
    ...(behavioralPortrait.traits || []),
    ...(behavioralPortrait.conversationSignals || [])
  ];

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
          <p className="panel-copy">{behavioralPortrait.summary}</p>
          <div className="detail-stack">
            {portraitDetails.map((trait) => (
              <div key={trait} className="detail-card profile-detail">
                <BrainCircuit size={16} />
                <span>{trait}</span>
              </div>
            ))}
          </div>

          <div className="section-heading compact mt-4">
            <h3>Emotional leanings</h3>
            <span>{behavioralPortrait.emotionalTraits.length} detected</span>
          </div>
          <div className="tag-list">
            {behavioralPortrait.emotionalTraits.length > 0 ? (
              behavioralPortrait.emotionalTraits.map((trait) => (
                <span key={trait} className="tag-chip profile-chip-soft">
                  {trait}
                </span>
              ))
            ) : (
              <span className="tag-chip muted">More chats needed</span>
            )}
          </div>

          <div className="section-heading compact mt-4">
            <h3>Response preferences</h3>
            <span>Best AI tone</span>
          </div>
          <div className="tag-list">
            {behavioralPortrait.responsePreferences.length > 0 ? (
              behavioralPortrait.responsePreferences.map((preference) => (
                <span key={preference} className="tag-chip">
                  {preference}
                </span>
              ))
            ) : (
              <span className="tag-chip muted">Still learning preferences</span>
            )}
          </div>

          <div className="section-heading compact mt-4">
            <h3>Recurring themes</h3>
            <span>{behavioralPortrait.recurringThemes.length} detected</span>
          </div>
          <div className="tag-list">
            {behavioralPortrait.recurringThemes.length > 0 ? (
              behavioralPortrait.recurringThemes.map((theme) => (
                <span key={theme} className="tag-chip">
                  {theme}
                </span>
              ))
            ) : (
              <span className="tag-chip muted">No themes detected yet</span>
            )}
          </div>
        </div>

        <div className="glass-panel profile-card">
          <div className="section-heading">
            <h3>Psychological Depth</h3>
            <span>Hidden AI Metrics</span>
          </div>
          
          <div className="mb-4">
            <span className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1 block">Communication Style</span>
            <p className="text-sm text-white/80 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
              {insights.structuredMemory.communicationStyle}
            </p>
          </div>

          <div className="mb-5">
            <span className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-1 block">Emotional Maturity</span>
            <p className="text-sm text-white/80 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
              {insights.structuredMemory.emotionalMaturity}
            </p>
          </div>

          <div className="section-heading compact">
            <h3>Support Needs</h3>
            <span>Optimal response strategy</span>
          </div>
          <div className="tag-list">
            {insights.structuredMemory.supportNeeds.length > 0 ? (
              insights.structuredMemory.supportNeeds.map((need) => (
                <span key={need} className="tag-chip !bg-emerald-500/10 !text-emerald-400 !border-emerald-500/20">
                  {need}
                </span>
              ))
            ) : (
              <span className="text-xs text-white/40 italic">Need more conversations to analyze...</span>
            )}
          </div>
        </div>

        <div className="glass-panel profile-card">
          <div className="section-heading">
            <h3>Recent highlights</h3>
            <span>Model, mood, and topic</span>
          </div>
          <div className="highlight-list">
            {recentInteractions.length > 0 ? (
              recentInteractions.map((interaction) => (
                <div key={interaction.id} className="highlight-card interaction-card">
                  <div className="interaction-header">
                    <strong>{interaction.model}</strong>
                    <span>{formatConversationDate(interaction.createdAt)}</span>
                  </div>
                  <div className="interaction-meta">{interaction.avatarName}</div>

                  <div className="interaction-block">
                    <span className="interaction-label">Talked about</span>
                    <p>{interaction.topic}</p>
                  </div>

                  <div className="interaction-block">
                    <span className="interaction-label">Emotional traits</span>
                    <div className="tag-list">
                      {interaction.emotionalTraits.map((trait) => (
                        <span key={trait} className="tag-chip emotion-chip">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="interaction-block">
                    <span className="interaction-label">One-line summary</span>
                    <p>{interaction.summary}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="highlight-card">
                <strong>No history yet</strong>
                <p>Start chatting so the AI can map recent models, moods, and themes.</p>
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
