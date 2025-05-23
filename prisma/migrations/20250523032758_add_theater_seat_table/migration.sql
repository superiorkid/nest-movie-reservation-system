/*
  Warnings:

  - Added the required column `theater_id` to the `Showtime` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShowtimeStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

-- DropIndex
DROP INDEX "Showtime_movie_id_idx";

-- AlterTable
ALTER TABLE "Showtime" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "status" "ShowtimeStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "theater_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Theater" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Showtime_movie_id_theater_id_idx" ON "Showtime"("movie_id", "theater_id");

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_theater_id_fkey" FOREIGN KEY ("theater_id") REFERENCES "Theater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
