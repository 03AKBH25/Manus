import { useEffect, useState } from "react";
import {
  Loader2,
  LogOut,
  MessageSquareMore,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import CustomAvatarPage from "./pages/CustomAvatarPage";
import {
  fetchCurrentUser,
  getStoredToken,
  setAuthToken
} from "./services/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState("chat");
  const [checkingSession, setCheckingSession] = useState(true);
  const [requestedAvatarId, setRequestedAvatarId] = useState(null);

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      const token = getStoredToken();

      if (!token) {
        setCheckingSession(false);
        return;
      }

      try {
        const user = await fetchCurrentUser();

        if (!ignore) {
          setCurrentUser(user);
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          setAuthToken("");
          setCurrentUser(null);
        }
      } finally {
        if (!ignore) {
          setCheckingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAuthenticated = ({ token, user }) => {
    setAuthToken(token);
    setCurrentUser(user);
    setActiveView("chat");
    setRequestedAvatarId(null);
  };

  const handleLogout = () => {
    setAuthToken("");
    setCurrentUser(null);
    setActiveView("chat");
    setRequestedAvatarId(null);
  };

  const handleCustomAvatarCreated = (avatar) => {
    setRequestedAvatarId(avatar.id);
    setActiveView("chat");
  };

  if (checkingSession) {
    return (
      <div className="auth-shell">
        <section className="glass-panel profile-loading">
          <Loader2 size={24} className="spin" />
          <span>Restoring secure session...</span>
        </section>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header glass-panel">
        <div>
          <div className="brand-pill">JWT Protected Workspace</div>
          <h1>{currentUser.name || currentUser.email}</h1>
        </div>

        <nav className="dashboard-nav">
          <button
            type="button"
            className={activeView === "chat" ? "active" : ""}
            onClick={() => setActiveView("chat")}
          >
            <MessageSquareMore size={16} />
            <span>Chat Studio</span>
          </button>
          <button
            type="button"
            className={activeView === "profile" ? "active" : ""}
            onClick={() => setActiveView("profile")}
          >
            <ShieldCheck size={16} />
            <span>Profile</span>
          </button>
          <button
            type="button"
            className={activeView === "builder" ? "active" : ""}
            onClick={() => setActiveView("builder")}
          >
            <Sparkles size={16} />
            <span>Create Avatar</span>
          </button>
          <button type="button" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </nav>
      </header>

      {activeView === "chat" ? (
        <ChatPage
          currentUser={currentUser}
          requestedAvatarId={requestedAvatarId}
          onRequestedAvatarApplied={() => setRequestedAvatarId(null)}
          onCreateCustomAvatar={() => setActiveView("builder")}
        />
      ) : activeView === "builder" ? (
        <CustomAvatarPage
          onCancel={() => setActiveView("chat")}
          onAvatarCreated={handleCustomAvatarCreated}
        />
      ) : (
        <ProfilePage currentUser={currentUser} onUserUpdate={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
