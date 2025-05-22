/*
  Warnings:

  - You are about to drop the column `category_id` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `MovieCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_category_id_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "category_id";

-- DropTable
DROP TABLE "MovieCategory";

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenreOnMovies" (
    "movie_id" TEXT NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "GenreOnMovies_pkey" PRIMARY KEY ("movie_id","genre_id")
);

-- CreateIndex
CREATE INDEX "Genre_title_idx" ON "Genre"("title");

-- AddForeignKey
ALTER TABLE "GenreOnMovies" ADD CONSTRAINT "GenreOnMovies_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreOnMovies" ADD CONSTRAINT "GenreOnMovies_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
