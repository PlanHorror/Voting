/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Signer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Signer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Signer" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Signer_email_key" ON "Signer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Signer_phone_key" ON "Signer"("phone");
