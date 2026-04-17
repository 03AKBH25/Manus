-- CreateTable
CREATE TABLE "UserMemoryProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "curatedAvatarReady" BOOLEAN NOT NULL DEFAULT false,
    "curatedAvatarName" TEXT,
    "curatedAvatarTitle" TEXT,
    "curatedAvatarImage" TEXT,
    "curatedAccentFrom" TEXT,
    "curatedAccentTo" TEXT,
    "profileSummary" TEXT NOT NULL,
    "personalityCore" TEXT NOT NULL,
    "emotionalMaturity" TEXT NOT NULL,
    "communicationStyle" TEXT NOT NULL,
    "preferenceProfile" JSONB NOT NULL,
    "emotionalProfile" JSONB NOT NULL,
    "supportNeeds" JSONB NOT NULL,
    "recurringThemes" JSONB NOT NULL,
    "notableFacts" JSONB NOT NULL,
    "sourceChatCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMemoryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarMemoryProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "avatarName" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "relationshipDynamic" TEXT NOT NULL,
    "communicationNotes" TEXT NOT NULL,
    "emotionalContext" JSONB NOT NULL,
    "recurringTopics" JSONB NOT NULL,
    "notableFacts" JSONB NOT NULL,
    "interactionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvatarMemoryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMemoryProfile_userId_key" ON "UserMemoryProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AvatarMemoryProfile_userId_avatarId_key" ON "AvatarMemoryProfile"("userId", "avatarId");

-- AddForeignKey
ALTER TABLE "UserMemoryProfile" ADD CONSTRAINT "UserMemoryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarMemoryProfile" ADD CONSTRAINT "AvatarMemoryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarMemoryProfile" ADD CONSTRAINT "AvatarMemoryProfile_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
