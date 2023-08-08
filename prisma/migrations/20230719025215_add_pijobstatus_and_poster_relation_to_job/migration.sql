/*
  Warnings:

  - You are about to drop the `_JobToResearcher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `posterId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `piStatus` to the `LabeledJob` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PIJobStatus" AS ENUM ('CONSIDERING', 'REVIEWING', 'REJECTED', 'INTERVIEWING', 'ACCEPTED', 'JOINED');

-- DropForeignKey
ALTER TABLE "_JobToResearcher" DROP CONSTRAINT "_JobToResearcher_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobToResearcher" DROP CONSTRAINT "_JobToResearcher_B_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "posterId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "LabeledJob" ADD COLUMN     "piStatus" "PIJobStatus" NOT NULL;

-- DropTable
DROP TABLE "_JobToResearcher";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "Researcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
