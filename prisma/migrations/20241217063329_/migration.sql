/*
  Warnings:

  - Added the required column `name` to the `Diets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `diets` ADD COLUMN `name` VARCHAR(191) NOT NULL;
