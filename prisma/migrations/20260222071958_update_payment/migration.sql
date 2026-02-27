/*
  Warnings:

  - A unique constraint covering the columns `[transaction_reference]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `collectedByAdminId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_transaction_reference_key` ON `Payment`(`transaction_reference`);

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_collectedByAdminId_fkey` FOREIGN KEY (`collectedByAdminId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
