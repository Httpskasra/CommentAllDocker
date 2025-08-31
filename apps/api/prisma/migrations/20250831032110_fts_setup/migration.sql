-- This is an empty migration.
-- اطمینان از اکستنشن‌ها
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ستون tsvector محاسباتی برای جستجوی متن روی Review(title + body)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Review' AND column_name = 'search_tsv'
  ) THEN
    ALTER TABLE "Review"
      ADD COLUMN search_tsv tsvector
      GENERATED ALWAYS AS (
        to_tsvector('simple', coalesce("title",'') || ' ' || coalesce("body",''))
      ) STORED;
  END IF;
END
$$;

-- ایندکس‌های جستجو/کارایی
CREATE INDEX IF NOT EXISTS idx_review_tsv
  ON "Review" USING GIN (search_tsv);

CREATE INDEX IF NOT EXISTS idx_review_productname_trgm
  ON "Review" USING GIN ("productName" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_review_status_created
  ON "Review" ("status","createdAt" DESC);

-- قید رنج امتیاز 0..100 (idempotent)
ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS review_rating_range;
ALTER TABLE "Review" ADD CONSTRAINT review_rating_range CHECK ("rating" BETWEEN 0 AND 100);
