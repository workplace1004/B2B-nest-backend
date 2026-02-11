-- CreateEnum
CREATE TYPE "VismaMappingStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "VismaSyncDirection" AS ENUM ('EXPORT', 'IMPORT', 'BIDIRECTIONAL');

-- CreateEnum
CREATE TYPE "VismaTransformation" AS ENUM ('NONE', 'UPPERCASE', 'LOWERCASE', 'TRIM');

-- CreateTable
CREATE TABLE "visma_mappings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sourceField" TEXT NOT NULL,
    "targetField" TEXT NOT NULL,
    "syncDirection" "VismaSyncDirection" NOT NULL DEFAULT 'BIDIRECTIONAL',
    "transformation" "VismaTransformation" NOT NULL DEFAULT 'NONE',
    "status" "VismaMappingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visma_mappings_pkey" PRIMARY KEY ("id")
);
