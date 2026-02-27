/*
  Warnings:

  - You are about to drop the column `productId` on the `review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Made the column `orderId` on table `review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_productId_fkey`;

-- DropIndex
DROP INDEX `Review_orderId_productId_key` ON `review`;

-- DropIndex
DROP INDEX `Review_productId_idx` ON `review`;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `productId`,
    MODIFY `orderId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Review_orderId_key` ON `Review`(`orderId`);

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
