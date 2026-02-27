/*
  Warnings:

  - Added the required column `updatedAt` to the `PermissionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `permissiongroup` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `RolePermissionGroup` (
    `roleId` INTEGER NOT NULL,
    `permissionGroupId` INTEGER NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`roleId`, `permissionGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RolePermissionGroup` ADD CONSTRAINT `RolePermissionGroup_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermissionGroup` ADD CONSTRAINT `RolePermissionGroup_permissionGroupId_fkey` FOREIGN KEY (`permissionGroupId`) REFERENCES `PermissionGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
