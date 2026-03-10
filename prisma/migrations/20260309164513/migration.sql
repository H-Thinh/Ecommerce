/*
  Warnings:

  - The values [partially_refunded] on the enum `Refund_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `refund` MODIFY `status` ENUM('pending', 'processing', 'failed', 'success') NOT NULL DEFAULT 'pending';
