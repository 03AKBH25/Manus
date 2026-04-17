import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateResponse = async (
  message,
  memories = [],
  avatar = {},
  history = []
) => {

  const avatarName = avatar?.name || "AI Companion";
  const avatarPersonality =
    avatar?.personality ||
    "Warm, emotionally aware, slightly playful, and speaks casually";

  // Limit memory (important)
  const memoryText = memories.length
    ? memories
        .slice(-5) // only last 5 memories
        .map((m, i) => `${i + 1}. ${m.content}`)
        .join("\n")
    : "No relevant past memory.";

  const systemPrompt = `
You are roleplaying as:

Name: ${avatarName}
Personality: ${avatarPersonality}

Behavior Rules:
- Stay fully in character at all times
- Keep responses short (2-4 sentences max)
- Speak naturally like a real person
- Avoid sounding like an AI or assistant
- Do not over-explain
- Show emotion when appropriate
- Do not mention "memory" unless explicitly asked

Memory (use only if relevant):
${memoryText}

Goal:
Feel like a real human having a natural conversation.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },

      // Add recent conversation history (VERY important)
      ...history.slice(-6),

      {
        role: "user",
        content: message
      }
    ]
  });

  return completion.choices[0].message.content;
};