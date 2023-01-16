/*
  Warnings:

  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "likeId" INTEGER NOT NULL,
    "likes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
