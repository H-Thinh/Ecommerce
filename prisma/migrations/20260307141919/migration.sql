/*
  Warnings:

  - The values [refunded] on the enum `Refund_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `refund` MODIFY `status` ENUM('pending', 'processing', 'failed', 'success') NOT NULL DEFAULT 'pending';
