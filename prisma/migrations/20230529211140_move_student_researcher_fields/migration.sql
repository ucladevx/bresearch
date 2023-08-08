/*
  Warnings:

  - You are about to drop the column `firstName` on the `Researcher` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Researcher` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `preferredName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `secondMajor` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `secondMinor` on the `StudentProfile` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Researcher" DROP COLUMN "firstName",
DROP COLUMN "lastName";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "preferredName";

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "secondMajor",
DROP COLUMN "secondMinor",
ADD COLUMN     "additionalMajor" "Major",
ADD COLUMN     "additionalMinor" "Minor",
ADD COLUMN     "firstName" VARCHAR(80) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(80) NOT NULL;
