-- CreateEnum
CREATE TYPE "SyncLogStatus" AS ENUM ('SUCCESS', 'FAILED', 'IN_PROGRESS', 'PENDING');

-- CreateEnum
CREATE TYPE "SyncLogType" AS ENUM ('FULL', 'INCREMENTAL', 'MAPPING');

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" SERIAL NOT NULL,
    "syncType" "SyncLogType" NOT NULL DEFAULT 'FULL',
    "status" "SyncLogStatus" NOT NULL DEFAULT 'PENDING',
    "mappingId" INTEGER,
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_logs_status_idx" ON "sync_logs"("status");

-- CreateIndex
CREATE INDEX "sync_logs_startedAt_idx" ON "sync_logs"("startedAt");

-- CreateIndex
CREATE INDEX "sync_logs_mappingId_idx" ON "sync_logs"("mappingId");
