-- CreateEnum
CREATE TYPE "BOPISOrderStatus" AS ENUM ('PENDING', 'READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BORISReturnStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'RECEIVED', 'PROCESSED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('NEW', 'USED', 'DAMAGED', 'DEFECTIVE');

-- CreateTable
CREATE TABLE "bopis_orders" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "status" "BOPISOrderStatus" NOT NULL DEFAULT 'PENDING',
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readyForPickupDate" TIMESTAMP(3),
    "pickedUpDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "pickupInstructions" TEXT,
    "customerNotes" TEXT,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bopis_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bopis_order_items" (
    "id" SERIAL NOT NULL,
    "bopisOrderId" INTEGER NOT NULL,
    "orderLineId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "size" TEXT,
    "color" TEXT,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "readyAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bopis_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boris_returns" (
    "id" SERIAL NOT NULL,
    "returnId" INTEGER NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "status" "BORISReturnStatus" NOT NULL DEFAULT 'PENDING',
    "returnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedDate" TIMESTAMP(3),
    "processedDate" TIMESTAMP(3),
    "reason" TEXT NOT NULL,
    "refundAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boris_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boris_return_items" (
    "id" SERIAL NOT NULL,
    "borisReturnId" INTEGER NOT NULL,
    "orderLineId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "condition" "ItemCondition" NOT NULL DEFAULT 'NEW',
    "refundAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boris_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endless_aisle_products" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "estimatedShippingDays" INTEGER NOT NULL DEFAULT 3,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT,
    "collection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "endless_aisle_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endless_aisle_warehouses" (
    "id" SERIAL NOT NULL,
    "endlessAisleProductId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "availableQuantity" INTEGER NOT NULL DEFAULT 0,
    "estimatedShippingDays" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "endless_aisle_warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "operatingHours" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boris_returns_returnNumber_key" ON "boris_returns"("returnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stores_code_key" ON "stores"("code");

-- AddForeignKey
ALTER TABLE "bopis_orders" ADD CONSTRAINT "bopis_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bopis_orders" ADD CONSTRAINT "bopis_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bopis_orders" ADD CONSTRAINT "bopis_orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bopis_order_items" ADD CONSTRAINT "bopis_order_items_bopisOrderId_fkey" FOREIGN KEY ("bopisOrderId") REFERENCES "bopis_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bopis_order_items" ADD CONSTRAINT "bopis_order_items_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bopis_order_items" ADD CONSTRAINT "bopis_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boris_returns" ADD CONSTRAINT "boris_returns_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boris_returns" ADD CONSTRAINT "boris_returns_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boris_returns" ADD CONSTRAINT "boris_returns_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boris_return_items" ADD CONSTRAINT "boris_return_items_borisReturnId_fkey" FOREIGN KEY ("borisReturnId") REFERENCES "boris_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boris_return_items" ADD CONSTRAINT "boris_return_items_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boris_return_items" ADD CONSTRAINT "boris_return_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endless_aisle_products" ADD CONSTRAINT "endless_aisle_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endless_aisle_warehouses" ADD CONSTRAINT "endless_aisle_warehouses_endlessAisleProductId_fkey" FOREIGN KEY ("endlessAisleProductId") REFERENCES "endless_aisle_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endless_aisle_warehouses" ADD CONSTRAINT "endless_aisle_warehouses_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
