/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_voteSessionId_fkey";

-- DropForeignKey
ALTER TABLE "VoteParticipant" DROP CONSTRAINT "VoteParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoteParticipant" DROP CONSTRAINT "VoteParticipant_voteSessionId_fkey";

-- DropForeignKey
ALTER TABLE "VoteSession" DROP CONSTRAINT "VoteSession_signerId_fkey";

-- DropForeignKey
ALTER TABLE "VoteSession" DROP CONSTRAINT "VoteSession_supervisorId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_key_key" ON "Vote"("key");

-- AddForeignKey
ALTER TABLE "VoteSession" ADD CONSTRAINT "VoteSession_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteSession" ADD CONSTRAINT "VoteSession_signerId_fkey" FOREIGN KEY ("signerId") REFERENCES "Signer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteParticipant" ADD CONSTRAINT "VoteParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteParticipant" ADD CONSTRAINT "VoteParticipant_voteSessionId_fkey" FOREIGN KEY ("voteSessionId") REFERENCES "VoteSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_voteSessionId_fkey" FOREIGN KEY ("voteSessionId") REFERENCES "VoteSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
