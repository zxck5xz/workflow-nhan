-- Departments (teams) configured in Cấu hình, members linked to a department,
-- and timeline metadata for imported projects/tasks (previously dropped on save).
-- Imported timeline tasks have no assignee, so Task.assigneeId becomes optional.

-- CreateTable
CREATE TABLE IF NOT EXISTS "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "departmentId" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "timeline" JSONB;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "timeline" JSONB;
ALTER TABLE "Task" ALTER COLUMN "assigneeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Member" DROP CONSTRAINT IF EXISTS "Member_departmentId_fkey";
ALTER TABLE "Member" ADD CONSTRAINT "Member_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
