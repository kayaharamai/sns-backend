/*
  Warnings:

  - You are about to drop the column `userId` on the `Likes` table. All the data in the column will be lost.
  - Made the column `likes` on table `Likes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "userId",
ALTER COLUMN "likes" SET NOT NULL;
