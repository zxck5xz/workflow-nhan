-- AlterTable
ALTER TABLE "Member" ADD COLUMN "email" TEXT;
ALTER TABLE "Member" ADD COLUMN "password" TEXT;

-- Populate default values for existing rows
UPDATE "Member" SET "email" = CONCAT('user_', REPLACE(LOWER("id"), '-', '_'), '@placeholder.com') WHERE "email" IS NULL;
UPDATE "Member" SET "password" = '$2b$10$changethisdefaultpasswordhash' WHERE "password" IS NULL;

-- Make columns required
ALTER TABLE "Member" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "Member" ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");
