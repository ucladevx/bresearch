/*
  Warnings:

  - You are about to drop the column `careerGoals` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `careerGoals` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "careerGoals";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "careerGoals";

-- DropEnum
DROP TYPE "CareerGoal";
