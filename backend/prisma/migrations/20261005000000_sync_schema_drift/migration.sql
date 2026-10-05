-- ResearchReport and Task.result were added to schema.prisma without a
-- migration (applied via `prisma db push`). IF NOT EXISTS keeps this safe on
-- databases that already have them.

-- AlterTable
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "result" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ResearchReport" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "packageName" TEXT,
    "technicalData" JSONB,
    "interpretation" JSONB,
    "markdownReport" TEXT,
    "sentimentScore" DOUBLE PRECISION,
    "sentimentSummary" TEXT,
    "redditMentions" JSONB,
    "twitterMentions" JSONB,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ResearchReport_type_idx" ON "ResearchReport"("type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ResearchReport_packageName_idx" ON "ResearchReport"("packageName");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ResearchReport_createdAt_idx" ON "ResearchReport"("createdAt");
