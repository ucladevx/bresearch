-- CreateEnum
CREATE TYPE "Major" AS ENUM ('COGNITIVE_SCIENCE', 'COMPUTER_SCIENCE');

-- CreateEnum
CREATE TYPE "Minor" AS ENUM ('LINGUISTICS');

-- CreateEnum
CREATE TYPE "Pronouns" AS ENUM ('NOT_LISTED');

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "pronouns" "Pronouns" NOT NULL,
    "preferredEmail" VARCHAR(100),
    "phoneNumber" VARCHAR(30),
    "bio" VARCHAR(500) NOT NULL,
    "major" "Major" NOT NULL,
    "secondMajor" "Major",
    "minor" "Minor",
    "secondMinor" "Minor",
    "graduationDate" VARCHAR(12) NOT NULL,
    "gpa" VARCHAR(5) NOT NULL,
    "majorGpa" VARCHAR(5) NOT NULL,
    "skills" VARCHAR(60)[],
    "experience" VARCHAR(1000),
    "coursework" VARCHAR(800),
    "links" VARCHAR(200)[],

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentId_key" ON "StudentProfile"("studentId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
