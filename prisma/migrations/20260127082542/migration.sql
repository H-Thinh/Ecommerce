/*
  Warnings:

  - A unique constraint covering the columns `[Symbol]` on the table `Size` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Symbol` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `size` ADD COLUMN `Symbol` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Size_Symbol_key` ON `Size`(`Symbol`);
