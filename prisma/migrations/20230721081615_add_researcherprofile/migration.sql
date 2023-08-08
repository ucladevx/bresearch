-- CreateTable
CREATE TABLE "ResearcherProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "researcherId" UUID NOT NULL,
    "name" VARCHAR(161) NOT NULL,

    CONSTRAINT "ResearcherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearcherProfile_researcherId_key" ON "ResearcherProfile"("researcherId");

-- AddForeignKey
ALTER TABLE "ResearcherProfile" ADD CONSTRAINT "ResearcherProfile_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
