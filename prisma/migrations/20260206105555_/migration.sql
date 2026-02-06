-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MarketStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SizeSystem" AS ENUM ('US', 'EU', 'UK', 'JP', 'CN', 'AU');

-- CreateEnum
CREATE TYPE "ApiKeyType" AS ENUM ('API_KEY', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('HEALTHY', 'WARNING', 'ERROR', 'SYNCING');

-- CreateEnum
CREATE TYPE "NumberingRuleType" AS ENUM ('SKU', 'EAN', 'BARCODE');

-- CreateEnum
CREATE TYPE "NumberingRuleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('VAT', 'SALES_TAX', 'GST');

-- CreateEnum
CREATE TYPE "WarehouseDefaultStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "status" "BrandStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "markets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "status" "MarketStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_markets" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER NOT NULL,
    "marketId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localizations" (
    "id" SERIAL NOT NULL,
    "marketId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "timeFormat" TEXT NOT NULL DEFAULT '12h',
    "numberFormat" TEXT NOT NULL DEFAULT 'en-US',
    "sizeSystem" "SizeSystem" NOT NULL DEFAULT 'US',
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "lengthUnit" TEXT NOT NULL DEFAULT 'cm',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "localizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "ApiKeyType" NOT NULL,
    "description" TEXT,
    "permissions" TEXT[],
    "lastUsed" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_health" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "channelName" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'HEALTHY',
    "lastSync" TIMESTAMP(3),
    "nextSync" TIMESTAMP(3),
    "recordsSynced" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "syncDuration" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "numbering_rules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NumberingRuleType" NOT NULL,
    "prefix" TEXT,
    "suffix" TEXT,
    "length" INTEGER NOT NULL DEFAULT 8,
    "sequenceStart" INTEGER NOT NULL DEFAULT 1,
    "currentSequence" INTEGER NOT NULL DEFAULT 1,
    "format" TEXT NOT NULL,
    "status" "NumberingRuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "numbering_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_defaults" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TaxType" NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_defaults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_defaults" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "WarehouseDefaultStatus" NOT NULL DEFAULT 'ACTIVE',
    "capacity" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_defaults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_code_key" ON "brands"("code");

-- CreateIndex
CREATE UNIQUE INDEX "markets_code_key" ON "markets"("code");

-- CreateIndex
CREATE UNIQUE INDEX "brand_markets_brandId_marketId_key" ON "brand_markets"("brandId", "marketId");

-- CreateIndex
CREATE UNIQUE INDEX "localizations_marketId_key" ON "localizations"("marketId");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "sync_health_channelId_key" ON "sync_health"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_defaults_code_key" ON "warehouse_defaults"("code");

-- AddForeignKey
ALTER TABLE "brand_markets" ADD CONSTRAINT "brand_markets_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_markets" ADD CONSTRAINT "brand_markets_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localizations" ADD CONSTRAINT "localizations_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
