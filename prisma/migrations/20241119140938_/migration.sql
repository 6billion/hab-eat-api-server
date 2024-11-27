/*
  Warnings:

  - You are about to drop the column `hight` on the `Users` table. All the data in the column will be lost.
  - Added the required column `height` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `hight`,
    ADD COLUMN `activityLevel` ENUM('sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive') NOT NULL DEFAULT 'lightlyActive',
    ADD COLUMN `height` INTEGER NOT NULL;
