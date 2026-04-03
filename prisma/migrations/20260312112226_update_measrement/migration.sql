/*
  Warnings:

  - Added the required column `unit` to the `MeasurementType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `measurementtype` ADD COLUMN `unit` VARCHAR(191) NOT NULL;
