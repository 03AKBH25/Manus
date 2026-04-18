import { useState } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import AvatarPortrait from "../components/AvatarPortrait";
import { createCustomAvatar } from "../services/api";

const SCENE_OPTIONS = [
  {
    id: "neon-penthouse",
    name: "Neon Penthouse",
    description: "Late-night skyline energy with cinematic confidence.",
    accentFrom: "#f97316",
    accentTo: "#7c3aed"
  },
  {
    id: "forest-retreat",
    name: "Forest Retreat",
    description: "Quiet, restorative, and grounded in calm nature vibes.",
    accentFrom: "#34d399",
    accentTo: "#14532d"
  },
  {
    id: "midnight-library",
    name: "Midnight Library",
    description: "Reflective, intimate, and built for deeper conversations.",
    accentFrom: "#60a5fa",
    accentTo: "#1e293b"
  },
  {
    id: "retro-arcade",
    name: "Retro Arcade",
    description: "Playful chemistry with bright, witty momentum.",
    accentFrom: "#fb7185",
    accentTo: "#2563eb"
  },
  {
    id: "seaside-studio",
    name: "Seaside Studio",
    description: "Open, airy perspective with emotional clarity.",
    accentFrom: "#38bdf8",
    accentTo: "#0f766e"
  }
];

const PERSONALITY_OPTIONS = [
  {
    id: "warm-strategist",
    name: "Warm Strategist",
    description:
      "Grounded, emotionally intelligent, and excellent at turning chaos into a clear next step."
  },
  {
    id: "bold-muse",
    name: "Bold Muse",
    description:
      "Expressive, stylish, challenging in a good way, and unafraid to say the real thing."
  },
  {
    id: "soft-observer",
    name: "Soft Observer",
    description:
      "Gentle, perceptive, reassuring, and patient with emotionally complicated moments."
  },
  {
    id: "playful-spark",
    name: "Playful Spark",
    description:
      "Funny, quick, energetic, and able to keep serious conversations from feeling heavy."
  }
];

const IMAGE_OPTIONS = [
  {
    id: "image-1",
    name: "Editorial portrait",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "image-2",
    name: "Calm confidant",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "image-3",
    name: "Midnight muse",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "image-4",
    name: "Pattern reader",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80"
  }
];

function CustomAvatarPage({ onCancel, onAvatarCreated }) {
  const [name, setName] = useState("Nova Vale");
  const [selectedSceneId, setSelectedSceneId] = useState(SCENE_OPTIONS[0].id);
  const [selectedPersonalityId, setSelectedPersonalityId] = useState(
    PERSONALITY_OPTIONS[0].id
  );
  const [selectedImageId, setSelectedImageId] = useState(IMAGE_OPTIONS[0].id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedScene =
    SCENE_OPTIONS.find((scene) => scene.id === selectedSceneId) || SCENE_OPTIONS[0];
  const selectedPersonality =
    PERSONALITY_OPTIONS.find((option) => option.id === selectedPersonalityId) ||
    PERSONALITY_OPTIONS[0];
  const selectedImage =
    IMAGE_OPTIONS.find((option) => option.id === selectedImageId) ||
    IMAGE_OPTIONS[0];

  const previewAvatar = {
    name,
    title: `${selectedScene.name} guide`,
    image: selectedImage.image,
    accentFrom: selectedScene.accentFrom,
    accentTo: selectedScene.accentTo,
    description: `${selectedPersonality.name} energy inside a ${selectedScene.name.toLowerCase()} setting.`,
    badges: ["Custom avatar", selectedScene.name, selectedPersonality.name]
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await createCustomAvatar({
        name,
        scene: selectedScene.name,
        personality: selectedPersonality.description,
        image: selectedImage.image
      });

      onAvatarCreated(response.avatar);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError?.response?.data?.details?.[0] ||
          requestError?.response?.data?.error ||
          "Could not create the custom avatar right now."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="builder-shell">
      <div className="builder-grid">
        <form className="glass-panel builder-card builder-form" onSubmit={handleSubmit}>
          <div className="section-label">Custom Avatar Builder</div>
          <h2>Create a companion with its own scene, image, and energy.</h2>
          <p className="panel-copy">
            Build a user-owned avatar that appears in the avatar lineup and is
            ready for chat immediately after creation.
          </p>

          {error ? <div className="error-banner compact">{error}</div> : null}

          <label className="builder-field">
            <span>Avatar name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={60}
              placeholder="Give your avatar a name"
              required
            />
          </label>

          <div className="builder-section">
            <div className="section-heading compact">
              <h3>Select a scene</h3>
              <span>{selectedScene.name}</span>
            </div>
            <div className="option-grid">
              {SCENE_OPTIONS.map((scene) => (
                <button
                  key={scene.id}
                  type="button"
                  className={`option-card ${
                    selectedSceneId === scene.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSceneId(scene.id)}
                >
                  <strong>{scene.name}</strong>
                  <p>{scene.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="builder-section">
            <div className="section-heading compact">
              <h3>Choose a personality</h3>
              <span>{selectedPersonality.name}</span>
            </div>
            <div className="option-grid">
              {PERSONALITY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`option-card ${
                    selectedPersonalityId === option.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedPersonalityId(option.id)}
                >
                  <strong>{option.name}</strong>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="builder-section">
            <div className="section-heading compact">
              <h3>Pick an image</h3>
              <span>{selectedImage.name}</span>
            </div>
            <div className="image-grid">
              {IMAGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`image-option ${
                    selectedImageId === option.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedImageId(option.id)}
                >
                  <img src={option.image} alt={option.name} />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="builder-actions">
            <button type="button" className="secondary-action" onClick={onCancel}>
              <ArrowLeft size={16} />
              <span>Back to chat</span>
            </button>

            <button type="submit" className="primary-action" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Creating avatar...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Create custom avatar</span>
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="glass-panel builder-card builder-preview">
          <div className="section-label">Live Preview</div>
          <div className="builder-preview-hero">
            <AvatarPortrait avatar={previewAvatar} size="lg" />
            <div>
              <h3>{previewAvatar.name}</h3>
              <span>{previewAvatar.title}</span>
            </div>
          </div>

          <p className="panel-copy">{selectedPersonality.description}</p>

          <div className="builder-preview-block">
            <span className="interaction-label">Scene</span>
            <p>{selectedScene.description}</p>
          </div>

          <div className="builder-preview-block">
            <span className="interaction-label">What this avatar feels like</span>
            <div className="tag-list">
              {previewAvatar.badges.map((badge) => (
                <span key={badge} className="tag-chip">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="builder-preview-block">
            <span className="interaction-label">Starter behavior</span>
            <div className="detail-stack">
              <div className="detail-card">
                Opens with the energy of {selectedScene.name.toLowerCase()}.
              </div>
              <div className="detail-card">
                Replies with a {selectedPersonality.name.toLowerCase()} tone.
              </div>
              <div className="detail-card">
                Uses the chosen portrait as the visual identity in the avatar list.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CustomAvatarPage;
