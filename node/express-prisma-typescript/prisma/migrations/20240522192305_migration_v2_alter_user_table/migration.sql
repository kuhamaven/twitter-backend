/*
  Warnings:

  - You are about to drop the column `private` on the `User` table. All the data in the column will be lost.
  - Added the required column `isPrivate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "private",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL;
