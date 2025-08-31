/*
  Warnings:

  - You are about to drop the column `search_tsv` on the `Review` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."idx_review_productname_trgm";

-- DropIndex
DROP INDEX "public"."idx_review_status_created";

-- DropIndex
DROP INDEX "public"."idx_review_tsv";

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "search_tsv";
