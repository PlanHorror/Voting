/*
  Warnings:

  - A unique constraint covering the columns `[hashId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "hashId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_hashId_key" ON "Candidate"("hashId");
