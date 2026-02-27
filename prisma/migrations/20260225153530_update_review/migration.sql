/*
  Warnings:

  - Added the required column `images` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `review` ADD COLUMN `images` LONGTEXT NOT NULL;
