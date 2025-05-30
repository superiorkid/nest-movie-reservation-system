/*
  Warnings:

  - A unique constraint covering the columns `[payment_intent_id]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reservations_payment_intent_id_key" ON "reservations"("payment_intent_id");
