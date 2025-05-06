/*
  Warnings:

  - Added the required column `privateKey` to the `VoteSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `VoteSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VoteSession" ADD COLUMN     "privateKey" TEXT NOT NULL,
ADD COLUMN     "publicKey" TEXT NOT NULL;
