/*
  Warnings:

  - A unique constraint covering the columns `[likes]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Likes_likes_key" ON "Likes"("likes");
