/*
  Warnings:

  - The primary key for the `Accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The values [Kakao,Naver,Local] on the enum `Accounts_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `goalKcal` on the `Users` table. All the data in the column will be lost.
  - Added the required column `age` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Accounts` DROP PRIMARY KEY,
    MODIFY `type` ENUM('kakao', 'naver') NOT NULL,
    ADD PRIMARY KEY (`id`, `type`);

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `goalKcal`,
    ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `hasDisease` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sex` ENUM('male', 'felmale') NOT NULL,
    ADD COLUMN `type` ENUM('diet', 'bulk', 'maintain') NOT NULL,
    MODIFY `nickname` VARCHAR(191) NOT NULL DEFAULT '햅잇';
