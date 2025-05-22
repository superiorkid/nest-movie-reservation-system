/*
  Warnings:

  - Added the required column `movie_category_id` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "movie_category_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MovieCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovieCategory_title_idx" ON "MovieCategory"("title");

-- CreateIndex
CREATE INDEX "Movie_title_release_date_created_at_status_idx" ON "Movie"("title", "release_date", "created_at", "status");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_movie_category_id_fkey" FOREIGN KEY ("movie_category_id") REFERENCES "MovieCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
