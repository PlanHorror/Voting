-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "keyHash" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);
