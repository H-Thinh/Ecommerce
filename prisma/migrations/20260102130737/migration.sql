/*
  Warnings:

  - The primary key for the `rolepermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `rolepermission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `rolepermission` DROP PRIMARY KEY,
    DROP COLUMN `id`;
