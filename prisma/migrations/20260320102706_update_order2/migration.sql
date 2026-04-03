-- AlterTable
ALTER TABLE `order` ADD COLUMN `delivered_at` DATETIME(3) NULL,
    ADD COLUMN `estimated_delivery_at` DATETIME(3) NULL,
    ADD COLUMN `shipped_at` DATETIME(3) NULL;
