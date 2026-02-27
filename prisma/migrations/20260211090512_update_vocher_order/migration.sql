/*
  Warnings:

  - You are about to drop the column `shipping_address` on the `order` table. All the data in the column will be lost.
  - Added the required column `receiver_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `min_order_value` on table `voucher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `shipping_address`,
    ADD COLUMN `receiver_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiver_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiver_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiver_note` VARCHAR(191) NULL,
    ADD COLUMN `receiver_phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `voucher` MODIFY `min_order_value` DECIMAL(12, 2) NOT NULL;
