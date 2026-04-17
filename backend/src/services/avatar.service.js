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

const CURATED_IDENTITY_CATALOG = [
  {
    name: "Atlas Ray",
    title: "Curated Confidant",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    accentFrom: "#60a5fa",
    accentTo: "#1d4ed8"
  },
  {
    name: "Lina Vale",
    title: "Memory Mirror",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    accentFrom: "#f472b6",
    accentTo: "#7c3aed"
  },
  {
    name: "Kai Sol",
    title: "Pattern Reader",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    accentFrom: "#34d399",
    accentTo: "#0f766e"
  },
  {
    name: "Mira Quinn",
    title: "Emotional Cartographer",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    accentFrom: "#f59e0b",
    accentTo: "#db2777"
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

const uniqueValues = (values) => [...new Set(values.filter(Boolean))];

const safeArray = (value) => (Array.isArray(value) ? value : []);

const safeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const hashString = (value) =>
  [...value].reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 7);

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
    .slice(0, 5)
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
    traits.push(
      "Processes experiences personally and values emotionally relevant replies."
    );
  }

  if (!traits.length) {
    traits.push("Balances reflection with practical conversation and steady pacing.");
  }

  return {
    avgWords,
    questionRatio: Math.round(questionRatio * 100),
    exclamationRatio: Math.round(exclamationRatio * 100),
    firstPersonRatio: Math.round(firstPersonRatio * 100),
    traits: traits.slice(0, 3)
  };
};

const buildRecentHighlights = (chats) =>
  chats.slice(0, 4).map((chat) => ({
    id: chat.id,
    avatarId: chat.avatarId,
    avatarName: chat.avatar?.name || "Avatar",
    preview: trimText(chat.message, 90),
    createdAt: chat.createdAt
  }));

const buildEmotionalMaturity = ({ dominantEmotion, behavior, emotionSignals }) => {
  const stressScore =
    emotionSignals.find((signal) => signal.label === "Stressed")?.score || 0;
  const reflectiveScore =
    emotionSignals.find((signal) => signal.label === "Reflective")?.score || 0;
  const hopefulScore =
    emotionSignals.find((signal) => signal.label === "Hopeful")?.score || 0;

  if (reflectiveScore >= 18 && stressScore <= 24) {
    return "Shows strong emotional maturity, usually reflecting before reacting and staying fairly self-aware under pressure.";
  }

  if (stressScore >= 30 && hopefulScore >= 12) {
    return "Feels pressure deeply but still looks for growth, reassurance, and constructive ways forward.";
  }

  if (behavior.firstPersonRatio >= 45 && behavior.questionRatio >= 30) {
    return "Emotionally open and actively trying to understand inner patterns, even when the feelings are still in motion.";
  }

  return `Usually operates with a ${formatLabel(
    dominantEmotion
  ).toLowerCase()} emotional rhythm and learns through conversation rather than hiding reactions.`;
};

const buildCommunicationStyle = ({ behavior, dominantEmotion }) => {
  if (behavior.avgWords >= 18) {
    return "Prefers expressive, layered conversations with room for feelings, nuance, and context.";
  }

  if (behavior.questionRatio >= 35) {
    return "Engages through questions and reflective prompts, often using conversation to think things through.";
  }

  if (behavior.avgWords <= 9) {
    return "Leans toward concise communication and responds best to direct, clear replies that still feel human.";
  }

  return `Responds well to emotionally aware conversation with a ${formatLabel(
    dominantEmotion
  ).toLowerCase()} tone and moderate pacing.`;
};

const buildPersonalityCore = ({ topThemes, behavior, dominantEmotion }) => {
  const themeText =
    topThemes.length > 0 ? topThemes.slice(0, 3).join(", ") : "daily life and self-reflection";
  const keyTrait = behavior.traits[0]?.toLowerCase() || "balanced conversational habits";

  return `The user often returns to ${themeText}, with a ${formatLabel(
    dominantEmotion
  ).toLowerCase()} emotional center and ${keyTrait}`;
};

const buildPreferenceProfile = ({ topThemes, dominantEmotion, behavior }) => ({
  preferredTopics: topThemes,
  responseStyle: uniqueValues([
    behavior.avgWords >= 18 ? "emotionally detailed replies" : null,
    behavior.avgWords <= 9 ? "direct concise replies" : null,
    behavior.questionRatio >= 35 ? "reflective prompts" : null,
    dominantEmotion === "stressed" ? "grounding reassurance" : null,
    dominantEmotion === "playful" ? "light playful tone" : null,
    dominantEmotion === "reflective" ? "thoughtful introspection" : null
  ]),
  pacing:
    behavior.avgWords >= 18 ? "slow and layered" : behavior.avgWords <= 9 ? "quick and focused" : "moderate",
  asksForReflection: behavior.questionRatio >= 30
});

const buildSupportNeeds = ({ dominantEmotion, behavior }) =>
  uniqueValues([
    dominantEmotion === "stressed" ? "calm emotional grounding" : null,
    dominantEmotion === "hopeful" ? "forward-looking encouragement" : null,
    dominantEmotion === "reflective" ? "deep reflective dialogue" : null,
    behavior.firstPersonRatio >= 45 ? "personalized emotionally relevant responses" : null,
    behavior.avgWords <= 9 ? "short practical replies" : null
  ]);

const buildNotableFacts = ({ chats }) =>
  uniqueValues(
    chats.slice(0, 5).map((chat) => {
      if (!chat.message) {
        return null;
      }

      return trimText(chat.message, 90);
    })
  );

const buildAvatarPreferenceBreakdown = (chats) => {
  const counts = new Map();

  for (const chat of chats) {
    const avatarName = chat.avatar?.name;
    if (!avatarName) {
      continue;
    }

    counts.set(avatarName, (counts.get(avatarName) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([avatarName, count]) => `${avatarName} (${count} chats)`);
};

const getStableCuratedIdentity = (userId, existingProfile) => {
  if (
    existingProfile?.curatedAvatarName &&
    existingProfile?.curatedAvatarTitle &&
    existingProfile?.curatedAvatarImage &&
    existingProfile?.curatedAccentFrom &&
    existingProfile?.curatedAccentTo
  ) {
    return {
      name: existingProfile.curatedAvatarName,
      title: existingProfile.curatedAvatarTitle,
      image: existingProfile.curatedAvatarImage,
      accentFrom: existingProfile.curatedAccentFrom,
      accentTo: existingProfile.curatedAccentTo
    };
  }

  return CURATED_IDENTITY_CATALOG[
    hashString(userId) % CURATED_IDENTITY_CATALOG.length
  ];
};

const buildCollectiveAnalysis = (chats, personaSummary) => {
  const userMessages = chats.map((chat) => chat.message);
  const topThemes = extractThemeKeywords(userMessages);
  const emotion = analyzeEmotionalSignals(userMessages);
  const behavior = analyzeBehavior(userMessages);
  const avatarAffinity = buildAvatarPreferenceBreakdown(chats);
  const personalityCore = buildPersonalityCore({
    topThemes,
    behavior,
    dominantEmotion: emotion.dominant
  });
  const emotionalMaturity = buildEmotionalMaturity({
    dominantEmotion: emotion.dominant,
    behavior,
    emotionSignals: emotion.signals
  });
  const communicationStyle = buildCommunicationStyle({
    behavior,
    dominantEmotion: emotion.dominant
  });
  const preferenceProfile = buildPreferenceProfile({
    topThemes,
    dominantEmotion: emotion.dominant,
    behavior
  });
  const supportNeeds = buildSupportNeeds({
    dominantEmotion: emotion.dominant,
    behavior
  });
  const notableFacts = buildNotableFacts({ chats });
  const recurringThemes = uniqueValues([...topThemes, ...avatarAffinity]);
  const profileSummary =
    personaSummary ||
    `${personalityCore}. ${communicationStyle} ${emotionalMaturity}`;

  return {
    personaSummary: profileSummary,
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
    },
    structuredMemory: {
      personalityCore,
      emotionalMaturity,
      communicationStyle,
      preferenceProfile,
      emotionalProfile: {
        dominantEmotion: emotion.dominant,
        signals: emotion.signals
      },
      supportNeeds,
      recurringThemes,
      notableFacts
    }
  };
};

const buildAvatarSpecificAnalysis = (chats, avatar) => {
  const userMessages = chats.map((chat) => chat.message);
  const themes = extractThemeKeywords(userMessages);
  const emotion = analyzeEmotionalSignals(userMessages);
  const behavior = analyzeBehavior(userMessages);

  const summary =
    chats.length > 0
      ? `With ${avatar.name}, the user usually explores ${
          themes.slice(0, 2).join(" and ") || "everyday thoughts"
        } and responds best to ${behavior.traits[0]?.toLowerCase() || "steady conversation"}.`
      : `No personal memory has been formed with ${avatar.name} yet.`;

  return {
    avatarName: avatar.name,
    summary,
    relationshipDynamic:
      chats.length > 0
        ? `${avatar.name} should remember a ${formatLabel(
            emotion.dominant
          ).toLowerCase()} tone and ${behavior.avgWords >= 18 ? "emotionally detailed" : "more direct"} exchanges with this user.`
        : `${avatar.name} is still learning this user's rhythm.`,
    communicationNotes: buildCommunicationStyle({
      behavior,
      dominantEmotion: emotion.dominant
    }),
    emotionalContext: {
      dominantEmotion: emotion.dominant,
      signals: emotion.signals
    },
    recurringTopics: themes,
    notableFacts: buildNotableFacts({ chats }),
    interactionCount: chats.length
  };
};

const buildCuratedAvatarFromProfile = (userId, profile, insights) => ({
  id: getCuratedAvatarId(userId),
  name: profile.curatedAvatarName,
  title: profile.curatedAvatarTitle,
  type: "curated",
  personality: [
    "A bespoke companion created specifically for this user.",
    profile.personalityCore,
    profile.emotionalMaturity,
    profile.communicationStyle
  ].join(" "),
  description: `Built from ${profile.sourceChatCount} conversations across multiple avatars and shaped by recurring preferences, emotional patterns, and maturity signals.`,
  image: profile.curatedAvatarImage,
  accentFrom: profile.curatedAccentFrom,
  accentTo: profile.curatedAccentTo,
  badges: [
    "Collective memory",
    formatLabel(
      safeObject(profile.emotionalProfile).dominantEmotion || insights?.dominantEmotion || "balanced"
    ),
    safeArray(profile.recurringThemes)[0] || "Personalized"
  ],
  starterPrompts: [
    "Talk to me with the emotional maturity you have learned about me.",
    "Use everything you know about my patterns and preferences.",
    "Reflect my personality before you answer."
  ],
  insights
});

const stripInsights = ({ insights, ...avatar }) => avatar;

export const getCuratedAvatarId = (userId) => `${CURATED_AVATAR_PREFIX}${userId}`;

export const isCuratedAvatarId = (userId, avatarId) =>
  avatarId === getCuratedAvatarId(userId);

const mapCatalogAvatar = (avatar) => ({
  ...avatar,
  type: "preset"
});

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

export const syncUserMemoryProfile = async (userId, options = {}) => {
  await ensureUser(userId);

  const [persona, existingProfile, chats] = await Promise.all([
    prisma.persona.findUnique({
      where: { userId }
    }),
    prisma.userMemoryProfile.findUnique({
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
      take: 60
    })
  ]);

  const insights = buildCollectiveAnalysis(chats, persona?.summary);
  const curatedIdentity = getStableCuratedIdentity(userId, existingProfile);
  const shouldActivateCurated =
    options.activateCurated || existingProfile?.curatedAvatarReady || false;

  const profile = await prisma.userMemoryProfile.upsert({
    where: { userId },
    update: {
      curatedAvatarReady: shouldActivateCurated,
      curatedAvatarName: curatedIdentity.name,
      curatedAvatarTitle: curatedIdentity.title,
      curatedAvatarImage: curatedIdentity.image,
      curatedAccentFrom: curatedIdentity.accentFrom,
      curatedAccentTo: curatedIdentity.accentTo,
      profileSummary: insights.personaSummary,
      personalityCore: insights.structuredMemory.personalityCore,
      emotionalMaturity: insights.structuredMemory.emotionalMaturity,
      communicationStyle: insights.structuredMemory.communicationStyle,
      preferenceProfile: insights.structuredMemory.preferenceProfile,
      emotionalProfile: insights.structuredMemory.emotionalProfile,
      supportNeeds: insights.structuredMemory.supportNeeds,
      recurringThemes: insights.structuredMemory.recurringThemes,
      notableFacts: insights.structuredMemory.notableFacts,
      sourceChatCount: insights.stats.totalChats
    },
    create: {
      userId,
      curatedAvatarReady: shouldActivateCurated,
      curatedAvatarName: curatedIdentity.name,
      curatedAvatarTitle: curatedIdentity.title,
      curatedAvatarImage: curatedIdentity.image,
      curatedAccentFrom: curatedIdentity.accentFrom,
      curatedAccentTo: curatedIdentity.accentTo,
      profileSummary: insights.personaSummary,
      personalityCore: insights.structuredMemory.personalityCore,
      emotionalMaturity: insights.structuredMemory.emotionalMaturity,
      communicationStyle: insights.structuredMemory.communicationStyle,
      preferenceProfile: insights.structuredMemory.preferenceProfile,
      emotionalProfile: insights.structuredMemory.emotionalProfile,
      supportNeeds: insights.structuredMemory.supportNeeds,
      recurringThemes: insights.structuredMemory.recurringThemes,
      notableFacts: insights.structuredMemory.notableFacts,
      sourceChatCount: insights.stats.totalChats
    }
  });

  return {
    profile,
    insights
  };
};

export const syncAvatarMemoryProfile = async (userId, avatarId) => {
  const avatar = await resolveAvatarForChat(userId, avatarId, {
    includeCuratedWhenMissing: true
  });

  if (!avatar) {
    return null;
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId,
      avatarId
    },
    include: {
      avatar: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 40
  });

  const analysis = buildAvatarSpecificAnalysis(chats, avatar);

  return prisma.avatarMemoryProfile.upsert({
    where: {
      userId_avatarId: {
        userId,
        avatarId
      }
    },
    update: {
      avatarName: analysis.avatarName,
      summary: analysis.summary,
      relationshipDynamic: analysis.relationshipDynamic,
      communicationNotes: analysis.communicationNotes,
      emotionalContext: analysis.emotionalContext,
      recurringTopics: analysis.recurringTopics,
      notableFacts: analysis.notableFacts,
      interactionCount: analysis.interactionCount
    },
    create: {
      userId,
      avatarId,
      avatarName: analysis.avatarName,
      summary: analysis.summary,
      relationshipDynamic: analysis.relationshipDynamic,
      communicationNotes: analysis.communicationNotes,
      emotionalContext: analysis.emotionalContext,
      recurringTopics: analysis.recurringTopics,
      notableFacts: analysis.notableFacts,
      interactionCount: analysis.interactionCount
    }
  });
};

export const getUserInsights = async (userId) => {
  const { profile, insights } = await syncUserMemoryProfile(userId);

  return {
    ...insights,
    personaSummary: profile.profileSummary,
    structuredMemory: {
      personalityCore: profile.personalityCore,
      emotionalMaturity: profile.emotionalMaturity,
      communicationStyle: profile.communicationStyle,
      preferenceProfile: safeObject(profile.preferenceProfile),
      emotionalProfile: safeObject(profile.emotionalProfile),
      supportNeeds: safeArray(profile.supportNeeds),
      recurringThemes: safeArray(profile.recurringThemes),
      notableFacts: safeArray(profile.notableFacts)
    }
  };
};

export const syncCuratedAvatar = async (userId, options = {}) => {
  const { profile, insights } = await syncUserMemoryProfile(userId, {
    activateCurated: options.activateCurated
  });

  const curatedAvatar = buildCuratedAvatarFromProfile(userId, profile, insights);

  await upsertAvatarRecord(curatedAvatar);

  return curatedAvatar;
};

export const syncPersonaSummary = async (userId, existingInsights) => {
  const insights = existingInsights || (await getUserInsights(userId));

  await prisma.persona.upsert({
    where: { userId },
    update: {
      summary: insights.personaSummary
    },
    create: {
      userId,
      summary: insights.personaSummary
    }
  });

  return insights.personaSummary;
};

export const getStructuredMemoryContext = async (userId, avatarId) => {
  if (isCuratedAvatarId(userId, avatarId)) {
    const { profile } = await syncUserMemoryProfile(userId);

    return {
      scope: "collective",
      profileSummary: profile.profileSummary,
      personalityCore: profile.personalityCore,
      emotionalMaturity: profile.emotionalMaturity,
      communicationStyle: profile.communicationStyle,
      preferenceProfile: safeObject(profile.preferenceProfile),
      emotionalProfile: safeObject(profile.emotionalProfile),
      supportNeeds: safeArray(profile.supportNeeds),
      recurringThemes: safeArray(profile.recurringThemes),
      notableFacts: safeArray(profile.notableFacts)
    };
  }

  const avatarProfile = await syncAvatarMemoryProfile(userId, avatarId);

  if (!avatarProfile) {
    return {
      scope: "avatar",
      profileSummary: "",
      relationshipDynamic: "",
      communicationNotes: "",
      emotionalContext: {},
      recurringTopics: [],
      notableFacts: []
    };
  }

  return {
    scope: "avatar",
    profileSummary: avatarProfile.summary,
    relationshipDynamic: avatarProfile.relationshipDynamic,
    communicationNotes: avatarProfile.communicationNotes,
    emotionalContext: safeObject(avatarProfile.emotionalContext),
    recurringTopics: safeArray(avatarProfile.recurringTopics),
    notableFacts: safeArray(avatarProfile.notableFacts)
  };
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

  const [profile, insights] = await Promise.all([
    prisma.userMemoryProfile.findUnique({
      where: { userId }
    }),
    existingInsights ? Promise.resolve(existingInsights) : getUserInsights(userId)
  ]);

  if (!profile?.curatedAvatarReady) {
    return avatars;
  }

  const curatedAvatar = buildCuratedAvatarFromProfile(userId, profile, insights);
  await upsertAvatarRecord(curatedAvatar);

  return [stripInsights(curatedAvatar), ...avatars];
};

export const resolveAvatarForChat = async (
  userId,
  avatarId,
  options = { includeCuratedWhenMissing: false }
) => {
  if (isCuratedAvatarId(userId, avatarId)) {
    const profile = await prisma.userMemoryProfile.findUnique({
      where: { userId }
    });

    if (!profile?.curatedAvatarReady && !options.includeCuratedWhenMissing) {
      return null;
    }

    return stripInsights(await syncCuratedAvatar(userId, { activateCurated: false }));
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
  const defaultAvatar =
    avatars.find((avatar) => avatar.type !== "curated") || avatars[0] || null;

  return {
    userId,
    avatars,
    insights,
    activeAvatarId: defaultAvatar?.id || null
  };
};
