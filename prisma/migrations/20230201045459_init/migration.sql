/*
  Warnings:

  - Added the required column `followId` to the `Followers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followerId` to the `Followings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Followers" ADD COLUMN     "followId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Followings" ADD COLUMN     "followerId" INTEGER NOT NULL;
