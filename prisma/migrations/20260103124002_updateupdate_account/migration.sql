/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[password]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `account` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Account_name_key` ON `Account`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Account_password_key` ON `Account`(`password`);

-- CreateIndex
CREATE UNIQUE INDEX `Account_phone_key` ON `Account`(`phone`);
