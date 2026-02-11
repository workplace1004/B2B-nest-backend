-- CreateEnum
CREATE TYPE "PurchaseOrderApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WIPTrackingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PENDING', 'IN_PRODUCTION', 'COMPLETED', 'QUARANTINED');

-- CreateEnum
CREATE TYPE "ScanCodeType" AS ENUM ('BARCODE', 'QR', 'RFID');

-- CreateEnum
CREATE TYPE "ScanAction" AS ENUM ('LOOKUP', 'INVENTORY_UPDATE', 'TRANSFER', 'RECEIVING', 'SHIPPING');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('SUCCESS', 'ERROR', 'WARNING');

-- CreateEnum
CREATE TYPE "PickListStatus" AS ENUM ('DRAFT', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PickItemStatus" AS ENUM ('PENDING', 'PICKED', 'PARTIAL', 'SKIPPED');

-- CreateEnum
CREATE TYPE "PackSlipStatus" AS ENUM ('DRAFT', 'PACKING', 'PACKED', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShippingLabelStatus" AS ENUM ('PENDING', 'PRINTED', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReverseLogisticsStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'RECEIVED', 'INSPECTED', 'PROCESSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "purchase_orders" ADD COLUMN     "bOMId" INTEGER;

-- CreateTable
CREATE TABLE "supplier_price_history" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "productId" INTEGER,
    "productName" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "quantity" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_negotiation_notes" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_negotiation_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_approvals" (
    "id" SERIAL NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    "approverId" INTEGER,
    "approverName" TEXT NOT NULL,
    "status" "PurchaseOrderApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_wip_tracking" (
    "id" SERIAL NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "completedQty" INTEGER NOT NULL DEFAULT 0,
    "status" "WIPTrackingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_wip_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_batches" (
    "id" SERIAL NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "lotNumber" TEXT,
    "quantity" INTEGER NOT NULL,
    "productionDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" "BatchStatus" NOT NULL DEFAULT 'PENDING',
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landed_costs" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "shippingCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "freightCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "insuranceCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "customsDuty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "customsDutyRate" DECIMAL(65,30),
    "tariffs" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "portFees" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "handlingFees" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "otherCosts" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "otherCostsDescription" TEXT,
    "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalLandedCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "calculatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landed_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_history" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeType" "ScanCodeType" NOT NULL,
    "productId" INTEGER,
    "warehouseId" INTEGER,
    "action" "ScanAction" NOT NULL,
    "quantity" INTEGER,
    "status" "ScanStatus" NOT NULL,
    "message" TEXT,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scannedBy" TEXT,
    "metadata" JSONB,

    CONSTRAINT "scan_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pick_lists" (
    "id" TEXT NOT NULL,
    "pickListNumber" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "status" "PickListStatus" NOT NULL DEFAULT 'DRAFT',
    "assignedTo" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pick_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pick_list_items" (
    "id" TEXT NOT NULL,
    "pickListId" TEXT NOT NULL,
    "orderLineId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "binLocation" TEXT,
    "quantity" INTEGER NOT NULL,
    "pickedQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" "PickItemStatus" NOT NULL DEFAULT 'PENDING',
    "pickedBy" TEXT,
    "pickedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pick_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pack_slips" (
    "id" TEXT NOT NULL,
    "packSlipNumber" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "pickListId" TEXT,
    "warehouseId" INTEGER NOT NULL,
    "status" "PackSlipStatus" NOT NULL DEFAULT 'DRAFT',
    "packedBy" TEXT,
    "packedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pack_slips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pack_slip_items" (
    "id" TEXT NOT NULL,
    "packSlipId" TEXT NOT NULL,
    "orderLineId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "packedQty" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pack_slip_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_labels" (
    "id" TEXT NOT NULL,
    "labelNumber" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "packSlipId" TEXT,
    "carrier" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "serviceType" TEXT,
    "status" "ShippingLabelStatus" NOT NULL DEFAULT 'PENDING',
    "weight" DECIMAL(65,30),
    "dimensions" TEXT,
    "cost" DECIMAL(65,30),
    "printedAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reverse_logistics" (
    "id" TEXT NOT NULL,
    "rmaId" INTEGER NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "status" "ReverseLogisticsStatus" NOT NULL DEFAULT 'PENDING',
    "originName" TEXT,
    "originAddress" TEXT,
    "originCity" TEXT,
    "originState" TEXT,
    "originPostalCode" TEXT,
    "originCountry" TEXT,
    "destinationName" TEXT,
    "destinationAddress" TEXT,
    "destinationCity" TEXT,
    "destinationState" TEXT,
    "destinationPostalCode" TEXT,
    "destinationCountry" TEXT,
    "shippedDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "inspectedDate" TIMESTAMP(3),
    "processedDate" TIMESTAMP(3),
    "estimatedDeliveryDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reverse_logistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "landed_costs_orderId_key" ON "landed_costs"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "pick_lists_pickListNumber_key" ON "pick_lists"("pickListNumber");

-- CreateIndex
CREATE UNIQUE INDEX "pack_slips_packSlipNumber_key" ON "pack_slips"("packSlipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_labels_labelNumber_key" ON "shipping_labels"("labelNumber");

-- AddForeignKey
ALTER TABLE "supplier_price_history" ADD CONSTRAINT "supplier_price_history_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_negotiation_notes" ADD CONSTRAINT "supplier_negotiation_notes_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_bOMId_fkey" FOREIGN KEY ("bOMId") REFERENCES "boms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_approvals" ADD CONSTRAINT "purchase_order_approvals_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_wip_tracking" ADD CONSTRAINT "purchase_order_wip_tracking_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_batches" ADD CONSTRAINT "purchase_order_batches_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landed_costs" ADD CONSTRAINT "landed_costs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_history" ADD CONSTRAINT "scan_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_history" ADD CONSTRAINT "scan_history_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pick_list_items" ADD CONSTRAINT "pick_list_items_pickListId_fkey" FOREIGN KEY ("pickListId") REFERENCES "pick_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pick_list_items" ADD CONSTRAINT "pick_list_items_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pick_list_items" ADD CONSTRAINT "pick_list_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_slips" ADD CONSTRAINT "pack_slips_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_slips" ADD CONSTRAINT "pack_slips_pickListId_fkey" FOREIGN KEY ("pickListId") REFERENCES "pick_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_slips" ADD CONSTRAINT "pack_slips_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_slip_items" ADD CONSTRAINT "pack_slip_items_packSlipId_fkey" FOREIGN KEY ("packSlipId") REFERENCES "pack_slips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_slip_items" ADD CONSTRAINT "pack_slip_items_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_slip_items" ADD CONSTRAINT "pack_slip_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_labels" ADD CONSTRAINT "shipping_labels_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_labels" ADD CONSTRAINT "shipping_labels_packSlipId_fkey" FOREIGN KEY ("packSlipId") REFERENCES "pack_slips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reverse_logistics" ADD CONSTRAINT "reverse_logistics_rmaId_fkey" FOREIGN KEY ("rmaId") REFERENCES "returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
