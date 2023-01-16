/*
  Warnings:

  - You are about to drop the column `followers` on the `Followers` table. All the data in the column will be lost.
  - You are about to drop the column `followings` on the `Followings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Followers" DROP COLUMN "followers";

-- AlterTable
ALTER TABLE "Followings" DROP COLUMN "followings";
