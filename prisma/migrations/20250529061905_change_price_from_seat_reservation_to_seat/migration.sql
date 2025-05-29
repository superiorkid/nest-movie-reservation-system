/*
  Warnings:

  - You are about to drop the column `seat_price` on the `seat_reservations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "seat_reservations" DROP COLUMN "seat_price";

-- AlterTable
ALTER TABLE "seats" ADD COLUMN     "seat_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00;
