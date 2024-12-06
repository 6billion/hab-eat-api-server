/*
  Warnings:

  - You are about to drop the `ChallengeImageDetectionServerUrls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ChallengeImageDetectionServerUrls` DROP FOREIGN KEY `ChallengeImageDetectionServerUrls_challengeId_fkey`;

-- DropTable
DROP TABLE `ChallengeImageDetectionServerUrls`;

-- CreateTable
CREATE TABLE `ChallengeAiModels` (
    `challengeId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`challengeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChallengeAiModels` ADD CONSTRAINT `ChallengeAiModels_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
