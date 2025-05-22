/*
  Warnings:

  - You are about to drop the `GenreOnMovies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GenreOnMovies" DROP CONSTRAINT "GenreOnMovies_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "GenreOnMovies" DROP CONSTRAINT "GenreOnMovies_movie_id_fkey";

-- DropTable
DROP TABLE "GenreOnMovies";

-- CreateTable
CREATE TABLE "GenresOnMovies" (
    "movie_id" TEXT NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "GenresOnMovies_pkey" PRIMARY KEY ("movie_id","genre_id")
);

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
