-- CreateTable
CREATE TABLE `ChallengeImageDetectionServerUrls` (
    `challengeId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`challengeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChallengeImageDetectionServerUrls` ADD CONSTRAINT `ChallengeImageDetectionServerUrls_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
