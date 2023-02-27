/*
  Warnings:

  - Made the column `labId` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_labId_fkey";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "labId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
