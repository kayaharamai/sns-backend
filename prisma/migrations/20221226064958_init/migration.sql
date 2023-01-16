/*
  Warnings:

  - You are about to drop the column `followers` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followings` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "authorId" DROP NOT NULL,
ALTER COLUMN "img" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "followers",
DROP COLUMN "followings",
ALTER COLUMN "profilePiture" DROP NOT NULL,
ALTER COLUMN "coverPicture" DROP NOT NULL,
ALTER COLUMN "isAdmin" DROP NOT NULL,
ALTER COLUMN "desc" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Followers" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followers" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followings" (
    "id" SERIAL NOT NULL,
    "followId" INTEGER NOT NULL,
    "followings" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Followings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followings" ADD CONSTRAINT "Followings_followId_fkey" FOREIGN KEY ("followId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
