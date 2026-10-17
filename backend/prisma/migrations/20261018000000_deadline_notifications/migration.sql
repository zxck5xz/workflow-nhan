-- Deadline reminders for admins: per-account channel settings and a log of what
-- was already sent, so the daily cron never notifies twice for the same deadline.

-- CreateTable
CREATE TABLE "NotificationSetting" (
    "memberId" TEXT NOT NULL,
    "telegramEnabled" BOOLEAN NOT NULL DEFAULT false,
    "telegramChatId" TEXT,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("memberId")
);

-- CreateTable
CREATE TABLE "DeadlineNotice" (
    "taskId" TEXT NOT NULL,
    "daysBefore" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeadlineNotice_pkey" PRIMARY KEY ("taskId", "daysBefore", "dueDate")
);

-- AddForeignKey
ALTER TABLE "NotificationSetting" ADD CONSTRAINT "NotificationSetting_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeadlineNotice" ADD CONSTRAINT "DeadlineNotice_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
