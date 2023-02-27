-- CreateTable
CREATE TABLE "_LabToStudent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LabToStudent_AB_unique" ON "_LabToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_LabToStudent_B_index" ON "_LabToStudent"("B");

-- AddForeignKey
ALTER TABLE "_LabToStudent" ADD CONSTRAINT "_LabToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToStudent" ADD CONSTRAINT "_LabToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
