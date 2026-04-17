import axios from "axios";

const API_URL = "http://localhost:5000/chat";
const userId = "40f09f7d-8ac4-4e8a-a790-fedf89407223";
const avatarId = "2c722593-06fc-4808-a326-264c58c47b41";

const messages = [
  "Hi, my name is Aniket and I love building AI agents.",
  "I am currently working on a project called Manus.",
  "What is my name and what project am I working on?"
];

async function runTest() {
  console.log("🚀 Starting Memory Integration Test...\n");

  for (const msg of messages) {
    console.log(`👤 User: ${msg}`);
    try {
      const response = await axios.post(API_URL, { userId, avatarId, message: msg });
      console.log(`🤖 AI: ${response.data.data.response}\n`);
      // Short delay to ensure processing
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("❌ Request failed:", error.response?.data || error.message);
    }
  }
}

runTest();
