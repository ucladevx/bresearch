/*
  Warnings:

  - The values [INTERESTED,IN_PROGRESS,IN_REVIEW,WITHDRAWN,ACCEPTED,REJECTED] on the enum `JobStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobStatus_new" AS ENUM ('HIDDEN', 'SAVED', 'APPLIED');
ALTER TABLE "LabeledJob" ALTER COLUMN "status" TYPE "JobStatus_new" USING ("status"::text::"JobStatus_new");
ALTER TYPE "JobStatus" RENAME TO "JobStatus_old";
ALTER TYPE "JobStatus_new" RENAME TO "JobStatus";
DROP TYPE "JobStatus_old";
COMMIT;
