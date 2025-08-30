-- This is an empty migration.-- Extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- tsvector محاسباتی برای جستجوی Review(title/body)
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

-- ایندکس‌های جستجو و فید
CREATE INDEX IF NOT EXISTS idx_review_tsv
  ON "Review" USING GIN (search_tsv);

CREATE INDEX IF NOT EXISTS idx_product_name_trgm
  ON "Product" USING GIN ("name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_reviews_entity_status_created
  ON "Review" ("productId","status","createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_votes_review_vote
  ON "ReviewVote" ("reviewId","vote");

CREATE INDEX IF NOT EXISTS idx_comments_review
  ON "ReviewComment" ("reviewId");

-- محدودیت رِنج امتیاز 0..100
ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS review_rating_range;
ALTER TABLE "Review" ADD CONSTRAINT review_rating_range CHECK ("rating" BETWEEN 0 AND 100);
