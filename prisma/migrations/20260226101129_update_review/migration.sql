/*
  Warnings:

  - You are about to drop the column `orderId` on the `review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderItemId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderItemId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_orderId_fkey`;

-- DropIndex
DROP INDEX `Review_orderId_key` ON `review`;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `orderId`,
    ADD COLUMN `orderItemId` INTEGER NOT NULL,
    ADD COLUMN `productId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Review_orderItemId_key` ON `Review`(`orderItemId`);

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
