-- CreateTable
CREATE TABLE "VoteSession" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,

    CONSTRAINT "VoteSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" INTEGER NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VoteSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
