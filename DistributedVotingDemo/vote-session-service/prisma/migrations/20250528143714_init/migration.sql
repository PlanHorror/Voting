/*
  Warnings:

  - The primary key for the `Candidate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sessionId` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Candidate` table. All the data in the column will be lost.
  - The primary key for the `VoteSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `VoteSession` table. All the data in the column will be lost.
  - You are about to drop the column `timeEnd` on the `VoteSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voteSessionId` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `VoteSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signerId` to the `VoteSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supervisorId` to the `VoteSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `VoteSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VoteSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_sessionId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_pkey",
DROP COLUMN "sessionId",
DROP COLUMN "total",
ADD COLUMN     "hashId" TEXT,
ADD COLUMN     "totalVotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "voteSessionId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Candidate_id_seq";

-- AlterTable
ALTER TABLE "VoteSession" DROP CONSTRAINT "VoteSession_pkey",
DROP COLUMN "name",
DROP COLUMN "timeEnd",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "signerId" TEXT NOT NULL,
ADD COLUMN     "supervisorId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VoteSession_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VoteSession_id_seq";

-- CreateTable
CREATE TABLE "Supervisor" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signer" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_username_key" ON "Supervisor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Signer_username_key" ON "Signer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_hashId_key" ON "Candidate"("hashId");
