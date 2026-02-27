/*
  Warnings:

  - Added the required column `hex` to the `OrderStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderstatus` ADD COLUMN `hex` VARCHAR(191) NOT NULL;
