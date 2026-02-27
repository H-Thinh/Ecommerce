/*
  Warnings:

  - You are about to drop the column `is_approved` on the `review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId,productId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `review` DROP COLUMN `is_approved`,
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX `Review_status_idx` ON `Review`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `Review_orderId_productId_key` ON `Review`(`orderId`, `productId`);
