-- CreateEnum
CREATE TYPE "DataImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DataImportType" AS ENUM ('PRODUCTS', 'ORDERS', 'CUSTOMERS', 'INVENTORY', 'CUSTOM');

-- CreateTable
CREATE TABLE "data_imports" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "type" "DataImportType" NOT NULL DEFAULT 'CUSTOM',
    "status" "DataImportStatus" NOT NULL DEFAULT 'PENDING',
    "recordsTotal" INTEGER NOT NULL DEFAULT 0,
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "fileUrl" TEXT,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_imports_pkey" PRIMARY KEY ("id")
);
