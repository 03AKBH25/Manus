import { useState } from "react";
import { Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { loginUser, registerUser } from "../services/api";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: ""
};

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload =
        mode === "register"
          ? await registerUser(form)
          : await loginUser({
              email: form.email,
              password: form.password
            });

      onAuthenticated(payload);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError?.response?.data?.error ||
          "Authentication failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero glass-panel">
        <div className="brand-pill">Protected AI Avatar Platform</div>
        <h1>Private avatar conversations with memory, identity, and emotional context.</h1>
        <p>
          Register a user account to unlock JWT-protected chat, curated avatars,
          and a live profile showing how the AI understands the user.
        </p>
        <div className="auth-feature-list">
          <div className="detail-card">
            <Sparkles size={18} />
            <span>Curated avatar built from conversational behavior</span>
          </div>
          <div className="detail-card">
            <LockKeyhole size={18} />
            <span>JWT auth, rate limiting, and protected profile APIs</span>
          </div>
        </div>
      </section>

      <section className="auth-card glass-panel">
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
        </div>

        <div className="section-heading">
          <h3>{mode === "register" ? "Create account" : "Welcome back"}</h3>
          <span>{mode === "register" ? "Secure onboarding" : "JWT session"}</span>
        </div>

        {error ? <div className="error-banner compact">{error}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label>
              <span>Name</span>
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Aniket"
                autoComplete="name"
              />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="At least 8 characters"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
            />
          </label>

          <button type="submit" className="primary-action" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Please wait...</span>
              </>
            ) : mode === "register" ? (
              "Create secure account"
            ) : (
              "Login to dashboard"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AuthPage;
