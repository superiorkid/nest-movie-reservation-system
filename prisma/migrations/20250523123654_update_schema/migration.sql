/*
  Warnings:

  - You are about to drop the column `isBooked` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `showtime_id` on the `Seat` table. All the data in the column will be lost.
  - Added the required column `theater_id` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats_per_row` to the `Theater` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_showtime_id_fkey";

-- DropIndex
DROP INDEX "Showtime_movie_id_theater_id_idx";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "isBooked",
DROP COLUMN "showtime_id",
ADD COLUMN     "theater_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Theater" ADD COLUMN     "seats_per_row" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SeatReservation" (
    "id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeatReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeatReservation_seat_id_showtime_id_idx" ON "SeatReservation"("seat_id", "showtime_id");

-- CreateIndex
CREATE INDEX "Location_city_address_idx" ON "Location"("city", "address");

-- CreateIndex
CREATE INDEX "Seat_seat_number_idx" ON "Seat"("seat_number");

-- CreateIndex
CREATE INDEX "Showtime_movie_id_theater_id_start_time_idx" ON "Showtime"("movie_id", "theater_id", "start_time");

-- CreateIndex
CREATE INDEX "Theater_name_capacity_idx" ON "Theater"("name", "capacity");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_theater_id_fkey" FOREIGN KEY ("theater_id") REFERENCES "Theater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatReservation" ADD CONSTRAINT "SeatReservation_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatReservation" ADD CONSTRAINT "SeatReservation_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
