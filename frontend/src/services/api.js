import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

export const fetchBootstrapData = async (userId) => {
  const response = await API.get("/chat/bootstrap", {
    params: { userId }
  });

  return response.data.data;
};

export const fetchConversationHistory = async ({ userId, avatarId, limit = 16 }) => {
  const response = await API.get("/chat/history", {
    params: {
      userId,
      avatarId,
      limit
    }
  });

  return response.data.data;
};

export const generateCuratedAvatar = async (userId) => {
  const response = await API.post("/chat/curated-avatar", { userId });
  return response.data.data;
};

export const sendMessage = async (data) => {
  const response = await API.post("/chat", data);
  return response.data.data;
};

export default API;
