-- AlterTable
ALTER TABLE "LabeledJob" ADD COLUMN     "bookmarked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;