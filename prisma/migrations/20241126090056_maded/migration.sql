/*
  Warnings:

  - You are about to drop the column `rewards_points` on the `recycleitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `recycleitem` DROP COLUMN `rewards_points`;

-- AlterTable
ALTER TABLE `reward` MODIFY `imageUrl` VARCHAR(191) NULL;
