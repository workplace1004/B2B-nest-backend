-- CreateEnum
CREATE TYPE "ServiceCaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ServiceCasePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProductConfigurationType" AS ENUM ('ATTRIBUTES', 'TAXONOMY', 'BUNDLES');

-- CreateEnum
CREATE TYPE "SecurityConfigurationType" AS ENUM ('TWO_FACTOR', 'SSO');

-- CreateEnum
CREATE TYPE "StockControlConfigurationType" AS ENUM ('TRANSFERS', 'APPROVALS', 'CROSS_DOCK');

-- CreateEnum
CREATE TYPE "WarehouseConfigurationType" AS ENUM ('BINS', 'PUT_AWAY_RULES');

-- CreateTable
CREATE TABLE "service_cases" (
    "id" SERIAL NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "customerId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" "ServiceCaseStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ServiceCasePriority" NOT NULL DEFAULT 'MEDIUM',
    "assignedTo" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "service_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_configurations" (
    "id" SERIAL NOT NULL,
    "type" "ProductConfigurationType" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_configurations" (
    "id" SERIAL NOT NULL,
    "type" "SecurityConfigurationType" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_control_configurations" (
    "id" SERIAL NOT NULL,
    "type" "StockControlConfigurationType" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_control_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs_configurations" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_logs_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_configurations" (
    "id" SERIAL NOT NULL,
    "type" "WarehouseConfigurationType" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "b2b_terms_configurations" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "b2b_terms_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_cases_caseNumber_key" ON "service_cases"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key_key" ON "user_preferences"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "product_configurations_type_key" ON "product_configurations"("type");

-- CreateIndex
CREATE UNIQUE INDEX "security_configurations_type_key" ON "security_configurations"("type");

-- CreateIndex
CREATE UNIQUE INDEX "stock_control_configurations_type_key" ON "stock_control_configurations"("type");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_configurations_type_key" ON "warehouse_configurations"("type");

-- AddForeignKey
ALTER TABLE "service_cases" ADD CONSTRAINT "service_cases_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
