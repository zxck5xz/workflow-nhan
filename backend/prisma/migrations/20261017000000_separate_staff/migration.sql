-- Separate staff (Nhân sự) from login accounts (Member). Tasks are assigned to
-- staff; Member keeps only login/permission data.

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL,
    "avatarColor" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- Keep existing assignments: accounts that have tasks become staff with the same id
INSERT INTO "Staff" (id, name, email, role, "avatarColor", initials, "joinedAt", "departmentId")
SELECT m.id, m.name, m.email, m.role, m."avatarColor", m.initials, m."joinedAt", m."departmentId"
FROM "Member" m
WHERE m.id IN (SELECT DISTINCT "assigneeId" FROM "Task" WHERE "assigneeId" IS NOT NULL);

-- Task.assigneeId now points at Staff; removing a staff member unassigns their tasks
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_assigneeId_fkey";
UPDATE "Task" SET "assigneeId" = NULL
WHERE "assigneeId" IS NOT NULL AND "assigneeId" NOT IN (SELECT id FROM "Staff");
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Departments belong to staff, not accounts
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- Member."departmentId" is no longer used but stays until the previous Worker
-- (which still selects it) is gone; drop it in a later migration.
ALTER TABLE "Member" DROP CONSTRAINT IF EXISTS "Member_departmentId_fkey";

-- CreateIndex
CREATE INDEX "Staff_departmentId_idx" ON "Staff"("departmentId");
