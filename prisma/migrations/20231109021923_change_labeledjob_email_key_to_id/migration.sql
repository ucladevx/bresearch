/*
  Warnings:

  - The primary key for the `LabeledJob` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `applicantEmail` on the `LabeledJob` table. All the data in the column will be lost.
  - Added the required column `applicantId` to the `LabeledJob` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LabeledJob" DROP CONSTRAINT "LabeledJob_applicantEmail_fkey";

-- AlterTable
ALTER TABLE "LabeledJob" DROP CONSTRAINT "LabeledJob_pkey",
DROP COLUMN "applicantEmail",
ADD COLUMN     "applicantId" UUID NOT NULL,
ADD CONSTRAINT "LabeledJob_pkey" PRIMARY KEY ("jobId", "applicantId");

-- AddForeignKey
ALTER TABLE "LabeledJob" ADD CONSTRAINT "LabeledJob_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
