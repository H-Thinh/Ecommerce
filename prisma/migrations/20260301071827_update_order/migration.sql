-- AlterTable
ALTER TABLE `order` ADD COLUMN `cancel_reason` VARCHAR(191) NULL,
    ADD COLUMN `cancelledAt` DATETIME(3) NULL;
