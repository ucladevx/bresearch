/*
  Warnings:

  - Added the required column `labId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "labId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Lab" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LabToResearcher" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LabToResearcher_AB_unique" ON "_LabToResearcher"("A", "B");

-- CreateIndex
CREATE INDEX "_LabToResearcher_B_index" ON "_LabToResearcher"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToResearcher" ADD CONSTRAINT "_LabToResearcher_A_fkey" FOREIGN KEY ("A") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToResearcher" ADD CONSTRAINT "_LabToResearcher_B_fkey" FOREIGN KEY ("B") REFERENCES "Researcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
