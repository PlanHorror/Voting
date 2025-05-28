/*
  Warnings:

  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isUsed` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `keyHash` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `votedAt` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[voteSessionId,key]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteSessionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pkey",
DROP COLUMN "isUsed",
DROP COLUMN "keyHash",
DROP COLUMN "sessionId",
DROP COLUMN "signature",
DROP COLUMN "votedAt",
ADD COLUMN     "candidateId" TEXT,
ADD COLUMN     "isVoted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voteAt" TIMESTAMP(3),
ADD COLUMN     "voteSessionId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Vote_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Vote_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_key_key" ON "Vote"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voteSessionId_key_key" ON "Vote"("voteSessionId", "key");
