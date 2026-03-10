/*
  Warnings:

  - Made the column `statusId` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_statusId_fkey`;

-- DropIndex
DROP INDEX `Order_statusId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` MODIFY `statusId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `OrderStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
