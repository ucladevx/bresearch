/*
  Warnings:

  - Added the required column `department` to the `Lab` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lab" ADD COLUMN     "department" "Department" NOT NULL;
