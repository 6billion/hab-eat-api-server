/*
  Warnings:

  - The values [felmale] on the enum `Users_sex` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `sex` ENUM('male', 'female') NOT NULL;
