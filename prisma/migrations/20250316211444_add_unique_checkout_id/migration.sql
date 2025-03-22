/*
  Warnings:

  - A unique constraint covering the columns `[checkoutId]` on the table `AbandonedCart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AbandonedCart_customerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AbandonedCart_checkoutId_key" ON "AbandonedCart"("checkoutId");
