/*
  Warnings:

  - You are about to drop the column `user_id` on the `seat_reservations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seat_id,showtime_id]` on the table `seat_reservations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservation_id` to the `seat_reservations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "seat_reservations" DROP CONSTRAINT "seat_reservations_user_id_fkey";

-- DropIndex
DROP INDEX "seat_reservations_seat_id_showtime_id_idx";

-- AlterTable
ALTER TABLE "seat_reservations" DROP COLUMN "user_id",
ADD COLUMN     "reservation_id" TEXT NOT NULL,
ADD COLUMN     "seat_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showtimeId" TEXT NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seat_reservations_seat_id_showtime_id_key" ON "seat_reservations"("seat_id", "showtime_id");

-- AddForeignKey
ALTER TABLE "seat_reservations" ADD CONSTRAINT "seat_reservations_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "showtimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
