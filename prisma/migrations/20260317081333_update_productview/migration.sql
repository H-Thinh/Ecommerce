/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `ProductView` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `productview` ADD COLUMN `viewCount` INTEGER NOT NULL DEFAULT 1,
    ALTER COLUMN `viewedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `ProductView_userId_productId_key` ON `ProductView`(`userId`, `productId`);
