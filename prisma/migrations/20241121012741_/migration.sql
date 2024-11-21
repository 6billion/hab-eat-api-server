/*
  Warnings:

  - The primary key for the `ChallengeCertificationLogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `challengesParticipantsId` on the `ChallengeCertificationLogs` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ChallengeCertificationLogs` table. All the data in the column will be lost.
  - You are about to drop the `ChallengesParticipants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,challengeParticipantsId,date]` on the table `ChallengeCertificationLogs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `challengeParticipantsId` to the `ChallengeCertificationLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ChallengeCertificationLogs` DROP FOREIGN KEY `ChallengeCertificationLogs_challengesParticipantsId_fkey`;

-- DropForeignKey
ALTER TABLE `ChallengesParticipants` DROP FOREIGN KEY `ChallengesParticipants_challengeId_fkey`;

-- DropIndex
DROP INDEX `ChallengeCertificationLogs_userId_challengesParticipantsId_d_idx` ON `ChallengeCertificationLogs`;

-- AlterTable
ALTER TABLE `ChallengeCertificationLogs` DROP PRIMARY KEY,
    DROP COLUMN `challengesParticipantsId`,
    DROP COLUMN `id`,
    ADD COLUMN `challengeParticipantsId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Challenges` MODIFY `type` ENUM('bulk', 'diet', 'habit', 'protein2x') NOT NULL;

-- DropTable
DROP TABLE `ChallengesParticipants`;

-- CreateTable
CREATE TABLE `ChallengeParticipants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `challengeId` INTEGER NOT NULL,
    `challengeType` ENUM('bulk', 'diet', 'habit', 'protein2x') NOT NULL,
    `goalDays` INTEGER NOT NULL,
    `successDays` INTEGER NOT NULL,
    `joinDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `lastSuccessDate` DATE NULL,
    `lastCheckDate` DATE NULL,
    `status` BOOLEAN NOT NULL,

    INDEX `ChallengeParticipants_userId_endDate_idx`(`userId`, `endDate`),
    UNIQUE INDEX `ChallengeParticipants_userId_challengeId_key`(`userId`, `challengeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ChallengeCertificationLogs_userId_challengeParticipantsId_da_key` ON `ChallengeCertificationLogs`(`userId`, `challengeParticipantsId`, `date`);

-- AddForeignKey
ALTER TABLE `ChallengeParticipants` ADD CONSTRAINT `ChallengeParticipants_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeCertificationLogs` ADD CONSTRAINT `ChallengeCertificationLogs_challengeParticipantsId_fkey` FOREIGN KEY (`challengeParticipantsId`) REFERENCES `ChallengeParticipants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
