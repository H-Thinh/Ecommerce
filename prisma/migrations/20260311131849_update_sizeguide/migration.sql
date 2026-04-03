/*
  Warnings:

  - You are about to drop the column `genderId` on the `sizeguide` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `sizeguide` DROP FOREIGN KEY `SizeGuide_genderId_fkey`;

-- DropIndex
DROP INDEX `SizeGuide_genderId_fkey` ON `sizeguide`;

-- AlterTable
ALTER TABLE `sizeguide` DROP COLUMN `genderId`;
