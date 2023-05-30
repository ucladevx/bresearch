/*
  Warnings:

  - Added the required column `piStatus` to the `LabeledJob` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PIJobStatus" AS ENUM ('CONSIDERING', 'REVIEWING', 'REJECTED', 'INTERVIEWING', 'ACCEPTED', 'JOINED');

-- AlterTable
ALTER TABLE "LabeledJob" ADD COLUMN     "piStatus" "PIJobStatus" NOT NULL;
