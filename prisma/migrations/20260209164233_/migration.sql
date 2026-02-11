-- CreateEnum
CREATE TYPE "CycleCountType" AS ENUM ('ABC', 'FULL', 'RANDOM', 'LOCATION_BASED');

-- CreateEnum
CREATE TYPE "CycleCountStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CycleCountItemStatus" AS ENUM ('PENDING', 'COUNTED', 'VERIFIED', 'DISCREPANCY');

-- CreateEnum
CREATE TYPE "PhysicalInventoryStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PhysicalInventoryItemStatus" AS ENUM ('PENDING', 'COUNTED', 'VERIFIED', 'DISCREPANCY');

-- CreateTable
CREATE TABLE "cycle_counts" (
    "id" SERIAL NOT NULL,
    "countNumber" TEXT NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "countType" "CycleCountType" NOT NULL,
    "status" "CycleCountStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "assignedTo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cycle_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycle_count_items" (
    "id" SERIAL NOT NULL,
    "cycleCountId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT,
    "sku" TEXT,
    "binLocation" TEXT,
    "systemQuantity" INTEGER NOT NULL DEFAULT 0,
    "countedQuantity" INTEGER,
    "variance" INTEGER,
    "variancePercent" DECIMAL(65,30),
    "status" "CycleCountItemStatus" NOT NULL DEFAULT 'PENDING',
    "countedBy" TEXT,
    "countedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cycle_count_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physical_inventories" (
    "id" SERIAL NOT NULL,
    "inventoryNumber" TEXT NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "status" "PhysicalInventoryStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "assignedTo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physical_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physical_inventory_items" (
    "id" SERIAL NOT NULL,
    "physicalInventoryId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT,
    "sku" TEXT,
    "binLocation" TEXT,
    "systemQuantity" INTEGER NOT NULL DEFAULT 0,
    "countedQuantity" INTEGER,
    "variance" INTEGER,
    "variancePercent" DECIMAL(65,30),
    "status" "PhysicalInventoryItemStatus" NOT NULL DEFAULT 'PENDING',
    "countedBy" TEXT,
    "countedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physical_inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cycle_counts_countNumber_key" ON "cycle_counts"("countNumber");

-- CreateIndex
CREATE UNIQUE INDEX "physical_inventories_inventoryNumber_key" ON "physical_inventories"("inventoryNumber");

-- AddForeignKey
ALTER TABLE "cycle_counts" ADD CONSTRAINT "cycle_counts_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_count_items" ADD CONSTRAINT "cycle_count_items_cycleCountId_fkey" FOREIGN KEY ("cycleCountId") REFERENCES "cycle_counts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_count_items" ADD CONSTRAINT "cycle_count_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_inventories" ADD CONSTRAINT "physical_inventories_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_inventory_items" ADD CONSTRAINT "physical_inventory_items_physicalInventoryId_fkey" FOREIGN KEY ("physicalInventoryId") REFERENCES "physical_inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_inventory_items" ADD CONSTRAINT "physical_inventory_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
