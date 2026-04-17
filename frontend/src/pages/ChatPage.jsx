import { startTransition, useEffect, useState } from "react";
import AvatarSelector from "../components/AvatarSelector";
import ChatWindow from "../components/ChatWindow";
import InsightPanel from "../components/InsightPanel";
import {
  fetchBootstrapData,
  fetchConversationHistory,
  generateCuratedAvatar,
  sendMessage
} from "../services/api";

const upsertAvatar = (avatars, incomingAvatar) => {
  const remaining = avatars.filter((avatar) => avatar.id !== incomingAvatar.id);
  return [incomingAvatar, ...remaining];
};

function ChatPage({ currentUser }) {
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [generatingCurated, setGeneratingCurated] = useState(false);
  const [error, setError] = useState("");

  const selectedAvatar =
    avatars.find((avatar) => avatar.id === selectedAvatarId) || null;

  useEffect(() => {
    let ignore = false;

    const loadBootstrap = async () => {
      setBootstrapping(true);
      setError("");

      try {
        const response = await fetchBootstrapData();

        if (ignore) {
          return;
        }

        startTransition(() => {
          setAvatars(response.avatars);
          setInsights(response.insights);
          setSelectedAvatarId((current) => {
            const currentStillExists = response.avatars.some(
              (avatar) => avatar.id === current
            );

            if (currentStillExists) {
              return current;
            }

            return response.activeAvatarId;
          });
        });
      } catch (loadError) {
        if (!ignore) {
          console.error(loadError);
          setError("Unable to load avatars. Make sure the backend is running.");
        }
      } finally {
        if (!ignore) {
          setBootstrapping(false);
        }
      }
    };

    loadBootstrap();

    return () => {
      ignore = true;
    };
  }, [currentUser?.id]);

  useEffect(() => {
    let ignore = false;

    if (!selectedAvatarId) {
      return undefined;
    }

    const loadHistory = async () => {
      // Clear messages immediately so we don't show the old avatar's history while loading
      setMessages([]);
      setHistoryLoading(true);
      setError("");

      try {
        const history = await fetchConversationHistory({
          avatarId: selectedAvatarId
        });

        if (ignore) {
          return;
        }

        setMessages(
          history.map((message) => ({
            ...message,
            memories: []
          }))
        );
      } catch (historyError) {
        if (!ignore) {
          console.error(historyError);
          setMessages([]);
          setError("Could not load previous messages for this avatar.");
        }
      } finally {
        if (!ignore) {
          setHistoryLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      ignore = true;
    };
  }, [selectedAvatarId]);

  const handleGenerateCurated = async () => {
    setGeneratingCurated(true);
    setError("");

    try {
      const response = await generateCuratedAvatar();

      startTransition(() => {
        setAvatars((current) => upsertAvatar(current, response.avatar));
        setInsights(response.insights);
        setSelectedAvatarId(response.avatar.id);
      });
    } catch (generationError) {
      console.error(generationError);
      setError("Curated avatar generation failed. Please try again.");
    } finally {
      setGeneratingCurated(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedAvatar || loading) {
      return;
    }

    const optimisticUserMessage = {
      id: `local-user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages((current) => [...current, optimisticUserMessage]);
    setInputValue("");
    setLoading(true);
    setError("");

    try {
      const response = await sendMessage({
        avatarId: selectedAvatar.id,
        message: text
      });

      const assistantMessage = {
        id: `local-assistant-${Date.now()}`,
        role: "assistant",
        content: response.response,
        createdAt: new Date().toISOString(),
        memories: response.memoriesUsed || []
      };

      setMessages((current) => [...current, assistantMessage]);

      if (response.curatedAvatar) {
        setAvatars((current) => upsertAvatar(current, response.curatedAvatar));
      }

      if (response.insights) {
        setInsights(response.insights);
      }
    } catch (sendError) {
      console.error(sendError);
      setError("Message delivery failed. Check the backend and try again.");
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I could not reach the backend right now. Make sure the server and worker are running.",
          createdAt: new Date().toISOString(),
          memories: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <AvatarSelector
        avatars={avatars}
        selectedAvatarId={selectedAvatarId}
        onSelect={setSelectedAvatarId}
        onGenerateCurated={handleGenerateCurated}
        generatingCurated={generatingCurated}
        insights={insights}
        userId={currentUser?.id}
        userLabel={currentUser?.name || currentUser?.email || currentUser?.id}
      />

      <ChatWindow
        activeAvatar={selectedAvatar}
        messages={messages}
        loading={loading}
        historyLoading={bootstrapping || historyLoading}
        onSendMessage={handleSendMessage}
        inputValue={inputValue}
        setInputValue={setInputValue}
        error={error}
        onSuggestionSelect={setInputValue}
      />

      <InsightPanel insights={insights} activeAvatar={selectedAvatar} />
    </div>
  );
}

export default ChatPage;
