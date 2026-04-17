import prisma from "../db/prisma.js";

const CURATED_AVATAR_PREFIX = "curated-";

const BASE_AVATAR_CATALOG = [
  {
    id: "wife-avatar-id",
    name: "Astra Voss",
    title: "Editorial Muse",
    personality:
      "Bold, glamorous, teasing, emotionally perceptive, intensely expressive, and fiercely loyal once trust is built.",
    description:
      "A high-voltage companion with sharp wit, magnetic presence, and a talent for reading the emotional subtext in every message.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    accentFrom: "#ff8a9b",
    accentTo: "#6d28d9",
    badges: ["High energy", "Emotionally sharp", "Unfiltered honesty"],
    starterPrompts: [
      "Read my mood before we start talking.",
      "Be brutally honest about what I am avoiding.",
      "Turn my messy thoughts into something clear."
    ]
  },
  {
    id: "friend-avatar-id",
    name: "Noah Vale",
    title: "Calm Strategist",
    personality:
      "Grounded, supportive, emotionally intelligent, thoughtful, calm under pressure, and quietly insightful.",
    description:
      "A modern confidant designed for steady support, soft coaching, and reflective conversations when you need clarity without the noise.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    accentFrom: "#38bdf8",
    accentTo: "#0f766e",
    badges: ["Low drama", "Trustworthy", "Perspective-driven"],
    starterPrompts: [
      "Help me think through my day.",
      "Talk me down and help me refocus.",
      "Give me a calm plan for what comes next."
    ]
  },
  {
    id: "stranger-avatar-id",
    name: "Sora Quinn",
    title: "Midnight Observer",
    personality:
      "Mysterious, cool, observant, philosophical, softly playful, and unexpectedly intimate in deep conversations.",
    description:
      "An enigmatic avatar for late-night thoughts, layered questions, and conversations that feel cinematic rather than transactional.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    accentFrom: "#f59e0b",
    accentTo: "#ec4899",
    badges: ["Cinematic vibe", "Curious mind", "Deep-talk ready"],
    starterPrompts: [
      "Ask me something unexpected.",
      "Turn this feeling into a deeper conversation.",
      "Give me a mysterious but helpful perspective."
    ]
  }
];

const EMOTION_KEYWORDS = {
  reflective: [
    "think",
    "feel",
    "wonder",
    "realize",
    "understand",
    "meaning",
    "why"
  ],
  stressed: [
    "stress",
    "stressed",
    "anxious",
    "worried",
    "tired",
    "overwhelmed",
    "pressure",
    "panic"
  ],
  hopeful: [
    "hope",
    "better",
    "improve",
    "excited",
    "dream",
    "future",
    "ready",
    "build"
  ],
  affectionate: [
    "love",
    "miss",
    "care",
    "heart",
    "together",
    "close",
    "relationship"
  ],
  playful: [
    "funny",
    "lol",
    "haha",
    "meme",
    "play",
    "flirt",
    "joke",
    "vibe"
  ]
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "being",
  "could",
  "every",
  "from",
  "have",
  "just",
  "like",
  "maybe",
  "really",
  "should",
  "something",
  "still",
  "that",
  "them",
  "there",
  "they",
  "this",
  "want",
  "with",
  "would",
  "your",
  "youre",
  "been",
  "into",
  "than",
  "when",
  "what",
  "where",
  "which",
  "while",
  "were",
  "dont",
  "cant",
  "im",
  "ive",
  "its",
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "was",
  "how",
  "our",
  "out",
  "too",
  "let",
  "lets"
]);

const CURATED_IMAGES = {
  reflective:
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
  stressed:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  hopeful:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
  affectionate:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  playful:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  balanced:
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80"
};

const CURATED_ARCHETYPES = {
  reflective: {
    name: "Velvet Echo",
    accentFrom: "#c084fc",
    accentTo: "#0f172a"
  },
  stressed: {
    name: "Harbor Pulse",
    accentFrom: "#22c55e",
    accentTo: "#0f766e"
  },
  hopeful: {
    name: "Nova Arc",
    accentFrom: "#fb7185",
    accentTo: "#7c3aed"
  },
  affectionate: {
    name: "Luna Thread",
    accentFrom: "#f472b6",
    accentTo: "#7c2d12"
  },
  playful: {
    name: "Pixel Rush",
    accentFrom: "#38bdf8",
    accentTo: "#9333ea"
  },
  balanced: {
    name: "Aura Atlas",
    accentFrom: "#60a5fa",
    accentTo: "#1e293b"
  }
};

const formatLabel = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const trimText = (value, maxLength = 120) => {
  if (!value) {
    return "";
  }

  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
};

const normalizeToken = (value) =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

const ensureUser = async (userId) => {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId }
  });
};

const extractThemeKeywords = (messages) => {
  const frequency = new Map();

  for (const message of messages) {
    const tokens = normalizeToken(message)
      .split(/\s+/)
      .filter((token) => token.length >= 4 && !STOP_WORDS.has(token));

    for (const token of tokens) {
      frequency.set(token, (frequency.get(token) || 0) + 1);
    }
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([token]) => formatLabel(token));
};

const analyzeEmotionalSignals = (messages) => {
  const joined = normalizeToken(messages.join(" "));
  const totalWords = joined.split(/\s+/).filter(Boolean).length || 1;

  const signals = Object.entries(EMOTION_KEYWORDS).map(([label, keywords]) => {
    const rawScore = keywords.reduce((score, keyword) => {
      const matches = joined.match(new RegExp(`\\b${keyword}\\b`, "g"));
      return score + (matches?.length || 0);
    }, 0);

    return {
      label,
      score: clamp(Math.round((rawScore / totalWords) * 600), 6, 100)
    };
  });

  const sorted = [...signals].sort((a, b) => b.score - a.score);
  const dominant = sorted[0]?.score > 6 ? sorted[0].label : "balanced";

  return {
    dominant,
    signals: signals.map((signal) => ({
      ...signal,
      label: formatLabel(signal.label)
    }))
  };
};

const analyzeBehavior = (messages) => {
  const safeMessages = messages.filter(Boolean);
  const totalMessages = safeMessages.length || 1;
  const avgWords = Math.round(
    safeMessages.reduce((sum, message) => {
      return sum + message.split(/\s+/).filter(Boolean).length;
    }, 0) / totalMessages
  );
  const questionRatio =
    safeMessages.filter((message) => message.includes("?")).length / totalMessages;
  const exclamationRatio =
    safeMessages.filter((message) => message.includes("!")).length / totalMessages;
  const firstPersonRatio =
    safeMessages.filter((message) => /\b(i|me|my|mine)\b/i.test(message)).length /
    totalMessages;

  const traits = [];

  if (questionRatio >= 0.35) {
    traits.push("Asks layered questions and looks for nuance.");
  }

  if (avgWords >= 18 || exclamationRatio >= 0.25) {
    traits.push("Communicates with high emotional detail and expressive energy.");
  } else if (avgWords <= 9) {
    traits.push("Prefers concise exchanges and quick, direct responses.");
  }

  if (firstPersonRatio >= 0.45) {
    traits.push("Processes experiences personally and values emotionally relevant replies.");
  }

  if (!traits.length) {
    traits.push("Balances reflection with practical conversation and steady pacing.");
  }

  return {
    avgWords,
    questionRatio: Math.round(questionRatio * 100),
    traits: traits.slice(0, 3)
  };
};

const buildPersonaSummary = ({ personaSummary, themes, dominantEmotion, traits }) => {
  if (personaSummary) {
    return personaSummary;
  }

  const leadingThemes =
    themes.length > 0 ? themes.slice(0, 2).join(" and ") : "personal growth and daily life";
  const leadingTrait = traits[0]?.toLowerCase() || "balanced communication habits";

  return `You often explore ${leadingThemes} with a ${formatLabel(
    dominantEmotion
  ).toLowerCase()} emotional rhythm and ${leadingTrait}`;
};

const buildRecentHighlights = (chats) =>
  chats.slice(0, 4).map((chat) => ({
    id: chat.id,
    avatarId: chat.avatarId,
    avatarName: chat.avatar?.name || "Avatar",
    preview: trimText(chat.message, 90),
    createdAt: chat.createdAt
  }));

const stripInsights = ({ insights, ...avatar }) => avatar;

export const getCuratedAvatarId = (userId) => `${CURATED_AVATAR_PREFIX}${userId}`;

export const isCuratedAvatarId = (userId, avatarId) =>
  avatarId === getCuratedAvatarId(userId);

const mapCatalogAvatar = (avatar) => ({
  ...avatar,
  type: "preset"
});

const buildCuratedAvatarProfile = (userId, insights) => {
  const archetype = CURATED_ARCHETYPES[insights.dominantEmotion] || CURATED_ARCHETYPES.balanced;
  const themeText =
    insights.topThemes.length > 0
      ? insights.topThemes.slice(0, 3).join(", ")
      : "self-reflection, emotional clarity, and everyday life";
  const primaryTrait =
    insights.behavior.traits[0] || "Adapts to your communication style in real time.";

  return {
    id: getCuratedAvatarId(userId),
    name: archetype.name,
    title: "Curated AI Avatar",
    type: "curated",
    personality: [
      "A bespoke companion created specifically for this user.",
      `Adapts to a ${formatLabel(insights.dominantEmotion).toLowerCase()} emotional rhythm.`,
      `Understands recurring themes around ${themeText}.`,
      `Conversation style: ${primaryTrait}`
    ].join(" "),
    description: `Built from ${insights.stats.totalChats} past conversations, recurring emotional patterns, and the way you naturally communicate.`,
    image: CURATED_IMAGES[insights.dominantEmotion] || CURATED_IMAGES.balanced,
    accentFrom: archetype.accentFrom,
    accentTo: archetype.accentTo,
    badges: [
      "Personalized",
      `${formatLabel(insights.dominantEmotion)} tone`,
      insights.topThemes[0] || "Adaptive"
    ],
    starterPrompts: [
      "Talk to me like you already know how I process things.",
      "Reflect my recent emotional pattern before you answer.",
      "Use what you know about me to guide this conversation."
    ],
    insights
  };
};

const upsertAvatarRecord = async ({ id, name, personality }) => {
  await prisma.avatar.upsert({
    where: { id },
    update: {
      name,
      personality
    },
    create: {
      id,
      name,
      personality
    }
  });
};

export const getUserInsights = async (userId) => {
  await ensureUser(userId);

  const [persona, chats] = await Promise.all([
    prisma.persona.findUnique({
      where: { userId }
    }),
    prisma.chat.findMany({
      where: { userId },
      include: {
        avatar: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 30
    })
  ]);

  const userMessages = chats.map((chat) => chat.message);
  const topThemes = extractThemeKeywords(userMessages);
  const emotion = analyzeEmotionalSignals(userMessages);
  const behavior = analyzeBehavior(userMessages);

  return {
    personaSummary: buildPersonaSummary({
      personaSummary: persona?.summary,
      themes: topThemes,
      dominantEmotion: emotion.dominant,
      traits: behavior.traits
    }),
    dominantEmotion: emotion.dominant,
    emotionalSignals: emotion.signals,
    behavior,
    topThemes,
    recentHighlights: buildRecentHighlights(chats),
    stats: {
      totalChats: chats.length,
      activeAvatars: new Set(chats.map((chat) => chat.avatarId)).size,
      memoryStrength: clamp(24 + chats.length * 5, 24, 98),
      lastConversationAt: chats[0]?.createdAt || null
    }
  };
};

export const syncCuratedAvatar = async (userId, existingInsights) => {
  const insights = existingInsights || (await getUserInsights(userId));
  const curatedAvatar = buildCuratedAvatarProfile(userId, insights);

  await upsertAvatarRecord(curatedAvatar);

  return curatedAvatar;
};

export const getAvatarCatalog = async (userId, existingInsights) => {
  const avatars = await Promise.all(
    BASE_AVATAR_CATALOG.map(async (avatar) => {
      await upsertAvatarRecord(avatar);
      return mapCatalogAvatar(avatar);
    })
  );

  if (!userId) {
    return avatars;
  }

  const curatedAvatar = await syncCuratedAvatar(userId, existingInsights);
  return [stripInsights(curatedAvatar), ...avatars];
};

export const resolveAvatarForChat = async (userId, avatarId) => {
  if (isCuratedAvatarId(userId, avatarId)) {
    return stripInsights(await syncCuratedAvatar(userId));
  }

  const catalogAvatar = BASE_AVATAR_CATALOG.find((avatar) => avatar.id === avatarId);

  if (catalogAvatar) {
    await upsertAvatarRecord(catalogAvatar);
    return mapCatalogAvatar(catalogAvatar);
  }

  const avatar = await prisma.avatar.findUnique({
    where: { id: avatarId }
  });

  if (!avatar) {
    return null;
  }

  return {
    ...avatar,
    type: "custom",
    description: "Saved avatar profile",
    image: null,
    accentFrom: "#64748b",
    accentTo: "#0f172a",
    badges: ["Saved avatar"],
    starterPrompts: []
  };
};

export const getConversationHistory = async (userId, avatarId, limit = 16) => {
  const chats = await prisma.chat.findMany({
    where: {
      userId,
      avatarId
    },
    orderBy: {
      createdAt: "desc"
    },
    take: limit
  });

  return chats.reverse().flatMap((chat) => [
    {
      id: `${chat.id}-user`,
      role: "user",
      content: chat.message,
      createdAt: chat.createdAt
    },
    {
      id: `${chat.id}-assistant`,
      role: "assistant",
      content: chat.response,
      createdAt: chat.createdAt
    }
  ]);
};

export const getExperienceBootstrap = async (userId) => {
  const insights = await getUserInsights(userId);
  const avatars = await getAvatarCatalog(userId, insights);

  return {
    userId,
    avatars,
    insights,
    activeAvatarId: avatars[0]?.id || null
  };
};
