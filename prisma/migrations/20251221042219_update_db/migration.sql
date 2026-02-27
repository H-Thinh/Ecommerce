/*
  Warnings:

  - Added the required column `groupId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `permission` ADD COLUMN `groupId` INTEGER NOT NULL,
    ADD COLUMN `label` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `PermissionGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `sort_order` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PermissionGroup_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Permission_groupId_idx` ON `Permission`(`groupId`);

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `PermissionGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
