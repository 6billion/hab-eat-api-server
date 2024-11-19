/*
  Warnings:

  - The primary key for the `Accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The values [Google,Facebook] on the enum `Accounts_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Accounts` DROP PRIMARY KEY,
    MODIFY `type` ENUM('Kakao', 'Naver', 'Local') NOT NULL,
    ADD PRIMARY KEY (`id`, `type`);
