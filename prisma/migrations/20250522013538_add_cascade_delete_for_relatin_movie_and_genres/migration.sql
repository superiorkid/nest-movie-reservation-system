-- DropForeignKey
ALTER TABLE "GenresOnMovies" DROP CONSTRAINT "GenresOnMovies_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "GenresOnMovies" DROP CONSTRAINT "GenresOnMovies_movie_id_fkey";

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenresOnMovies" ADD CONSTRAINT "GenresOnMovies_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
