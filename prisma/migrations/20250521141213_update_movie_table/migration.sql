/*
  Warnings:

  - You are about to drop the column `movie_category_id` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_movie_category_id_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "movie_category_id",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "MovieCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
