/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MeasurementType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `MeasurementType_name_key` ON `MeasurementType`(`name`);
