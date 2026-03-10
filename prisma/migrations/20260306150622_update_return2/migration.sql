/*
  Warnings:

  - A unique constraint covering the columns `[orderItemId]` on the table `Return` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Return_orderItemId_key` ON `Return`(`orderItemId`);
