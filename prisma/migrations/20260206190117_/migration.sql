/*
  Warnings:

  - You are about to drop the column `rate` on the `tax_defaults` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tax_defaults" DROP COLUMN "rate",
ADD COLUMN     "taxRate" DECIMAL(65,30),
ADD COLUMN     "vatRate" DECIMAL(65,30);
