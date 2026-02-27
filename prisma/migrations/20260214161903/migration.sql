/*
  Warnings:

  - You are about to drop the column `provinceId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `province` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provincedistance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_provinceId_fkey`;

-- DropForeignKey
ALTER TABLE `provincedistance` DROP FOREIGN KEY `ProvinceDistance_fromProvinceId_fkey`;

-- DropForeignKey
ALTER TABLE `provincedistance` DROP FOREIGN KEY `ProvinceDistance_toProvinceId_fkey`;

-- DropIndex
DROP INDEX `Order_provinceId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `provinceId`;

-- DropTable
DROP TABLE `province`;

-- DropTable
DROP TABLE `provincedistance`;
