/*
  Warnings:

  - Made the column `slug` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `gender` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `category` MODIFY `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `gender` MODIFY `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `slug` VARCHAR(191) NOT NULL;
