/*
  Warnings:

  - Added the required column `startDate` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Made the column `closingDate` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "closingDate" SET NOT NULL;
