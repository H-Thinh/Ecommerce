/*
  Warnings:

  - You are about to drop the column `shippingMethodId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `shippingmethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_shippingMethodId_fkey`;

-- DropIndex
DROP INDEX `Order_shippingMethodId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `shippingMethodId`;

-- DropTable
DROP TABLE `shippingmethod`;
