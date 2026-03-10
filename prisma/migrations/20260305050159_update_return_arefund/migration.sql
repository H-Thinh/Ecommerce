/*
  Warnings:

  - You are about to drop the column `orderId` on the `refund` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `return` table. All the data in the column will be lost.
  - Added the required column `orderItemId` to the `Refund` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentId` on table `refund` required. This step will fail if there are existing NULL values in that column.
  - Made the column `returnId` on table `refund` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reason` on table `refund` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `orderItemId` to the `Return` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `Refund_returnId_fkey`;

-- DropForeignKey
ALTER TABLE `return` DROP FOREIGN KEY `Return_orderId_fkey`;

-- DropIndex
DROP INDEX `Refund_orderId_idx` ON `refund`;

-- DropIndex
DROP INDEX `Refund_returnId_idx` ON `refund`;

-- DropIndex
DROP INDEX `Return_orderId_fkey` ON `return`;

-- AlterTable
ALTER TABLE `refund` DROP COLUMN `orderId`,
    ADD COLUMN `orderItemId` INTEGER NOT NULL,
    MODIFY `paymentId` INTEGER NOT NULL,
    MODIFY `returnId` INTEGER NOT NULL,
    MODIFY `reason` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `return` DROP COLUMN `orderId`,
    ADD COLUMN `orderItemId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Refund_orderItemId_idx` ON `Refund`(`orderItemId`);

-- AddForeignKey
ALTER TABLE `Return` ADD CONSTRAINT `Return_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_returnId_fkey` FOREIGN KEY (`returnId`) REFERENCES `Return`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
