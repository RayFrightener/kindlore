-- CreateTable
CREATE TABLE "UserDailyActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserDailyActivity_userId_idx" ON "UserDailyActivity"("userId");

-- CreateIndex
CREATE INDEX "UserDailyActivity_activityDate_idx" ON "UserDailyActivity"("activityDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyActivity_userId_activityDate_key" ON "UserDailyActivity"("userId", "activityDate");

-- AddForeignKey
ALTER TABLE "UserDailyActivity" ADD CONSTRAINT "UserDailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
