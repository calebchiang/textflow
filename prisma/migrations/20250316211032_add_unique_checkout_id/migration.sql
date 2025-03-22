/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `AbandonedCart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AbandonedCart_customerId_key" ON "AbandonedCart"("customerId");
