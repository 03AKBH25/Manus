import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

const TOKEN_STORAGE_KEY = "manus-avatar-auth-token";
let authToken =
  typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : "";

API.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export const setAuthToken = (token) => {
  authToken = token || "";

  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const getStoredToken = () => authToken;

export const registerUser = async ({ name, email, password }) => {
  const response = await API.post("/auth/register", {
    name,
    email,
    password
  });

  return response.data.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await API.post("/auth/login", {
    email,
    password
  });

  return response.data.data;
};

export const fetchCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data.data;
};

export const updateCurrentUser = async ({ name }) => {
  const response = await API.patch("/auth/me", { name });
  return response.data.data;
};

export const fetchMyProfile = async () => {
  const response = await API.get("/profile/me");
  return response.data.data;
};

export const fetchBootstrapData = async () => {
  const response = await API.get("/chat/bootstrap");

  return response.data.data;
};

export const fetchConversationHistory = async ({ avatarId, limit = 16 }) => {
  const response = await API.get("/chat/history", {
    params: {
      avatarId,
      limit
    }
  });

  return response.data.data;
};

export const generateCuratedAvatar = async () => {
  const response = await API.post("/chat/curated-avatar");
  return response.data.data;
};

export const sendMessage = async (data) => {
  const response = await API.post("/chat", data);
  return response.data.data;
};

export default API;
