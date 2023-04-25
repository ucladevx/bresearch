/*
  Warnings:

  - Added the required column `location` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('ON_CAMPUS', 'OFF_CAMPUS', 'REMOTE');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "location" "Location" NOT NULL;
