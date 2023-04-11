/*
  Warnings:

  - You are about to drop the column `labId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `Lab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LabToResearcher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LabToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_labId_fkey";

-- DropForeignKey
ALTER TABLE "_LabToResearcher" DROP CONSTRAINT "_LabToResearcher_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabToResearcher" DROP CONSTRAINT "_LabToResearcher_B_fkey";

-- DropForeignKey
ALTER TABLE "_LabToStudent" DROP CONSTRAINT "_LabToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabToStudent" DROP CONSTRAINT "_LabToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "labId";

-- DropTable
DROP TABLE "Lab";

-- DropTable
DROP TABLE "_LabToResearcher";

-- DropTable
DROP TABLE "_LabToStudent";
