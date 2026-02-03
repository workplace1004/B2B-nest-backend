-- CreateTable
CREATE TABLE "cost_sheets" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "materials" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "labor" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "overhead" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "sellingPrice" DECIMAL(65,30) DEFAULT 0,
    "margin" DECIMAL(65,30),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cost_sheets_productId_key" ON "cost_sheets"("productId");

-- AddForeignKey
ALTER TABLE "cost_sheets" ADD CONSTRAINT "cost_sheets_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
