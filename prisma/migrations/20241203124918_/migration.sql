/*
  Warnings:

  - Added the required column `category` to the `Foods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Foods` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Foods_name_key` ON `Foods`;

-- AlterTable
ALTER TABLE `Foods` ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD COLUMN `servingSize` DOUBLE NULL,
    ADD PRIMARY KEY (`id`);
