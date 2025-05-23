/*
  Warnings:

  - You are about to drop the column `location` on the `Theater` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `Theater` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theater" DROP COLUMN "location",
ADD COLUMN     "location_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Theater" ADD CONSTRAINT "Theater_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
