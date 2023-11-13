/*
  Warnings:

  - You are about to alter the column `profilePicture` on the `ResearcherProfile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `profilePicture` on the `StudentProfile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "ResearcherProfile" ALTER COLUMN "profilePicture" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "StudentProfile" ALTER COLUMN "profilePicture" SET DATA TYPE VARCHAR(200);
