/*
  Warnings:

  - You are about to drop the column `external` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "external",
ADD COLUMN     "externalLink" VARCHAR(200);
