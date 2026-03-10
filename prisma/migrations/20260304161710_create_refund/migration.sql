/*
  Warnings:

  - You are about to drop the `useraddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userphone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `useraddress` DROP FOREIGN KEY `UserAddress_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userphone` DROP FOREIGN KEY `UserPhone_userId_fkey`;

-- DropTable
DROP TABLE `useraddress`;

-- DropTable
DROP TABLE `userphone`;

-- CreateTable
CREATE TABLE `Refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `paymentId` INTEGER NULL,
    `returnId` INTEGER NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `reason` LONGTEXT NULL,
    `status` ENUM('pending', 'processing', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `transaction_reference` VARCHAR(191) NULL,
    `processedByAdminId` INTEGER NULL,
    `refundedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Refund_transaction_reference_key`(`transaction_reference`),
    INDEX `Refund_orderId_idx`(`orderId`),
    INDEX `Refund_paymentId_idx`(`paymentId`),
    INDEX `Refund_returnId_idx`(`returnId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_returnId_fkey` FOREIGN KEY (`returnId`) REFERENCES `Return`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_processedByAdminId_fkey` FOREIGN KEY (`processedByAdminId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
