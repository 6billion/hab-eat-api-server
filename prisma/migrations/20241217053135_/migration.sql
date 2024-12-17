/*
  Warnings:

  - The primary key for the `DietStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,date]` on the table `DietStats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `DietStats` DROP PRIMARY KEY;

-- CreateIndex
CREATE UNIQUE INDEX `DietStats_userId_date_key` ON `DietStats`(`userId`, `date`);
