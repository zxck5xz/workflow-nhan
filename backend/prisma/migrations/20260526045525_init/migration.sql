-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('backlog', 'in_testing', 'evaluating', 'reporting', 'done');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('P0', 'P1', 'P2');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatarColor" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "priority" "Priority" NOT NULL,
    "weight" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "eisenhowerUrgent" BOOLEAN NOT NULL DEFAULT false,
    "eisenhowerImportant" BOOLEAN NOT NULL DEFAULT false,
    "eisenhowerAutoClassified" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusConfig" (
    "id" "TaskStatus" NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "StatusConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriorityConfig" (
    "id" "Priority" NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "defaultWeight" INTEGER NOT NULL,

    CONSTRAINT "PriorityConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameScorecard" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "ratingsCoreLoop" INTEGER NOT NULL,
    "ratingsMonetization" INTEGER NOT NULL,
    "ratingsVisualUx" INTEGER NOT NULL,
    "ratingsRetention" INTEGER NOT NULL,
    "ratingsUsp" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameScorecard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyInsight" (
    "id" TEXT NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "overallStatus" TEXT NOT NULL,
    "highlights" JSONB,
    "risks" JSONB,
    "actionItems" JSONB,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL,
    "snapshotDate" DATE NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Task_deadline_idx" ON "Task"("deadline");

-- CreateIndex
CREATE INDEX "GameScorecard_projectId_idx" ON "GameScorecard"("projectId");

-- CreateIndex
CREATE INDEX "GameScorecard_week_idx" ON "GameScorecard"("week");

-- CreateIndex
CREATE INDEX "GameScorecard_authorId_idx" ON "GameScorecard"("authorId");

-- CreateIndex
CREATE INDEX "WeeklyInsight_week_idx" ON "WeeklyInsight"("week");

-- CreateIndex
CREATE INDEX "WeeklyInsight_authorId_idx" ON "WeeklyInsight"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_snapshotDate_key" ON "Snapshot"("snapshotDate");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameScorecard" ADD CONSTRAINT "GameScorecard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameScorecard" ADD CONSTRAINT "GameScorecard_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyInsight" ADD CONSTRAINT "WeeklyInsight_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
