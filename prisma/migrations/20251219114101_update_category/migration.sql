/*
  Warnings:

  - Added the required column `image_category` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `image_category` VARCHAR(191) NOT NULL;
