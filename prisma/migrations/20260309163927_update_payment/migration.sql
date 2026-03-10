-- AlterTable
ALTER TABLE `refund` MODIFY `status` ENUM('pending', 'partially_refunded', 'processing', 'failed', 'success') NOT NULL DEFAULT 'pending';
