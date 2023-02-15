-- CreateEnum
CREATE TYPE "Department" AS ENUM ('ENGINEERING', 'HUMANITIES', 'LIFE_SCIENCES', 'PHYSICAL_SCIENCES', 'SOCIAL_SCIENCES');

-- CreateEnum
CREATE TYPE "CareerGoal" AS ENUM ('PRE_MED', 'PRE_LAW', 'PRE_GRAD_SCHOOL');

-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('QUARTERLY', 'SUMMER', 'ACADEMIC_YEAR', 'YEAR_ROUND');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('HIDDEN', 'INTERESTED', 'IN_PROGRESS', 'APPLIED', 'IN_REVIEW', 'WITHDRAWN', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Student" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(80) NOT NULL,
    "preferredName" VARCHAR(80),
    "lastName" VARCHAR(80) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "careerGoals" "CareerGoal"[],
    "departments" "Department"[],

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Researcher" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(80) NOT NULL,
    "lastName" VARCHAR(80) NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "Researcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closingDate" TIMESTAMP(3),
    "closed" BOOLEAN NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "labId" UUID,
    "paid" BOOLEAN NOT NULL,
    "duration" "Duration" NOT NULL,
    "departments" "Department"[],
    "careerGoals" "CareerGoal"[],
    "weeklyHours" INTEGER NOT NULL,
    "credit" BOOLEAN NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabeledJob" (
    "jobId" INTEGER NOT NULL,
    "applicantId" UUID NOT NULL,
    "status" "JobStatus" NOT NULL,

    CONSTRAINT "LabeledJob_pkey" PRIMARY KEY ("jobId","applicantId")
);

-- CreateTable
CREATE TABLE "_LabToResearcher" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_JobToResearcher" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Researcher_email_key" ON "Researcher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_slug_key" ON "Lab"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_LabToResearcher_AB_unique" ON "_LabToResearcher"("A", "B");

-- CreateIndex
CREATE INDEX "_LabToResearcher_B_index" ON "_LabToResearcher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JobToResearcher_AB_unique" ON "_JobToResearcher"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToResearcher_B_index" ON "_JobToResearcher"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabeledJob" ADD CONSTRAINT "LabeledJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabeledJob" ADD CONSTRAINT "LabeledJob_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToResearcher" ADD CONSTRAINT "_LabToResearcher_A_fkey" FOREIGN KEY ("A") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToResearcher" ADD CONSTRAINT "_LabToResearcher_B_fkey" FOREIGN KEY ("B") REFERENCES "Researcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToResearcher" ADD CONSTRAINT "_JobToResearcher_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToResearcher" ADD CONSTRAINT "_JobToResearcher_B_fkey" FOREIGN KEY ("B") REFERENCES "Researcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
