-- CreateEnum
CREATE TYPE "DataExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DataExportType" AS ENUM ('PRODUCTS', 'ORDERS', 'CUSTOMERS', 'INVENTORY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DataExportFormat" AS ENUM ('CSV', 'EXCEL');

-- CreateTable
CREATE TABLE "data_exports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "format" "DataExportFormat" NOT NULL DEFAULT 'CSV',
    "type" "DataExportType" NOT NULL DEFAULT 'CUSTOM',
    "status" "DataExportStatus" NOT NULL DEFAULT 'PENDING',
    "recordsCount" INTEGER NOT NULL DEFAULT 0,
    "fileSize" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "fileUrl" TEXT,
    "filePath" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_exports_pkey" PRIMARY KEY ("id")
);
