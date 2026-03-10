/*
  Warnings:

  - Made the column `season` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `season` ENUM('SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL') NOT NULL;
