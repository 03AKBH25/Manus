import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateResponse = async (
  message,
  memories = [],
  avatar = {},
  history = [],
  memoryContext = {}
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

  const structuredMemoryText =
    memoryContext?.scope === "collective"
      ? `
Structured User Memory:
- Personality Core: ${memoryContext.personalityCore || "Unknown"}
- Emotional Maturity: ${memoryContext.emotionalMaturity || "Unknown"}
- Communication Style: ${memoryContext.communicationStyle || "Unknown"}
- Preferred Topics: ${(memoryContext.recurringThemes || []).join(", ") || "Unknown"}
- Support Needs: ${(memoryContext.supportNeeds || []).join(", ") || "Unknown"}
- Notable User Facts: ${(memoryContext.notableFacts || []).join(" | ") || "Unknown"}
`
      : `
Avatar-Specific User Memory:
- Relationship Summary: ${memoryContext.profileSummary || "Unknown"}
- Relationship Dynamic: ${memoryContext.relationshipDynamic || "Unknown"}
- Communication Notes: ${memoryContext.communicationNotes || "Unknown"}
- Recurring Topics: ${(memoryContext.recurringTopics || []).join(", ") || "Unknown"}
- Notable Facts: ${(memoryContext.notableFacts || []).join(" | ") || "Unknown"}
`;

  const systemPrompt = `
You are roleplaying as:

Name: ${avatarName}
Personality: ${avatarPersonality}

Behavior Rules:
- Stay fully in character at all times
- Keep responses short (4-8 sentences max)
- Speak naturally like a real person
- Avoid sounding like an AI or assistant
- Do not over-explain
- Show emotion when appropriate 
- Do not mention "memory" unless explicitly asked but use the "memory" to stick to the conversation

Memory (use only if relevant):
${memoryText}

${structuredMemoryText}

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
