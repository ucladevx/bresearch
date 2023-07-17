/*
  Warnings:

  - You are about to drop the column `userId` on the `Researcher` table. All the data in the column will be lost.
  - You are about to drop the column `departments` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Researcher" DROP CONSTRAINT "Researcher_userId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropIndex
DROP INDEX "Researcher_userId_key";

-- DropIndex
DROP INDEX "Student_userId_key";

-- AlterTable
ALTER TABLE "Researcher" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "departments",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
