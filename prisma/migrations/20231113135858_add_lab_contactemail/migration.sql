/*
  Warnings:

  - Added the required column `contactEmail` to the `Lab` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lab" ADD COLUMN     "contactEmail" VARCHAR(100) NOT NULL;
