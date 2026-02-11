-- CreateEnum
CREATE TYPE "AllocationMethod" AS ENUM ('FIFO', 'LIFO', 'PRIORITY', 'ROUND_ROBIN', 'PROXIMITY');

-- CreateEnum
CREATE TYPE "AllocationChannel" AS ENUM ('DTC', 'POS', 'B2B', 'WHOLESALE', 'ALL');

-- CreateEnum
CREATE TYPE "PreOrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BackorderStatus" AS ENUM ('PENDING', 'ALLOCATED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PartialShipmentStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "allocation_rules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "channel" "AllocationChannel" NOT NULL DEFAULT 'ALL',
    "customerId" INTEGER,
    "customerType" "CustomerType",
    "warehouseId" INTEGER,
    "allocationMethod" "AllocationMethod" NOT NULL DEFAULT 'FIFO',
    "conditions" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allocation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_orders" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "orderLineId" INTEGER,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expectedDate" TIMESTAMP(3),
    "status" "PreOrderStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backorders" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "orderLineId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "BackorderStatus" NOT NULL DEFAULT 'PENDING',
    "allocatedQty" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "backorders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partial_shipments" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "shipmentNumber" TEXT NOT NULL,
    "status" "PartialShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "shippedDate" TIMESTAMP(3),
    "deliveredDate" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partial_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partial_shipment_items" (
    "id" SERIAL NOT NULL,
    "partialShipmentId" INTEGER NOT NULL,
    "orderLineId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partial_shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partial_shipments_shipmentNumber_key" ON "partial_shipments"("shipmentNumber");

-- AddForeignKey
ALTER TABLE "allocation_rules" ADD CONSTRAINT "allocation_rules_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocation_rules" ADD CONSTRAINT "allocation_rules_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_orders" ADD CONSTRAINT "pre_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_orders" ADD CONSTRAINT "pre_orders_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_orders" ADD CONSTRAINT "pre_orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backorders" ADD CONSTRAINT "backorders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backorders" ADD CONSTRAINT "backorders_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backorders" ADD CONSTRAINT "backorders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partial_shipments" ADD CONSTRAINT "partial_shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partial_shipment_items" ADD CONSTRAINT "partial_shipment_items_partialShipmentId_fkey" FOREIGN KEY ("partialShipmentId") REFERENCES "partial_shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partial_shipment_items" ADD CONSTRAINT "partial_shipment_items_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partial_shipment_items" ADD CONSTRAINT "partial_shipment_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
