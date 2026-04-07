/*
  Warnings:

  - You are about to drop the `monthlyreport` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `dailyreport` ADD COLUMN `total_products_sold` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `monthlyreport`;
