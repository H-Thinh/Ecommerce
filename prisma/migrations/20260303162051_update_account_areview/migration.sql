-- DropIndex
DROP INDEX `Account_name_key` ON `account`;

-- DropIndex
DROP INDEX `Account_password_key` ON `account`;

-- DropIndex
DROP INDEX `Account_phone_key` ON `account`;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `shopRepliedAt` DATETIME(3) NULL,
    ADD COLUMN `shopRepliedBy` INTEGER NULL,
    ADD COLUMN `shopReply` LONGTEXT NULL;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_shopRepliedBy_fkey` FOREIGN KEY (`shopRepliedBy`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
