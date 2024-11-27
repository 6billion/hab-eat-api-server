-- CreateTable
CREATE TABLE `Challenges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `targetUserType` ENUM('diet', 'bulk', 'maintain') NOT NULL,
    `type` ENUM('bulk', 'diet', 'habit') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChallengesParticipants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `challengeId` INTEGER NOT NULL,
    `challengeType` ENUM('bulk', 'diet', 'habit') NOT NULL,
    `goalDays` INTEGER NOT NULL,
    `successDays` INTEGER NOT NULL,
    `joinDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `status` BOOLEAN NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ChallengesParticipants_userId_endDate_idx`(`userId`, `endDate`),
    UNIQUE INDEX `ChallengesParticipants_userId_challengeId_key`(`userId`, `challengeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChallengeCertificationLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `challengesParticipantsId` INTEGER NOT NULL,
    `date` DATE NOT NULL,

    INDEX `ChallengeCertificationLogs_userId_challengesParticipantsId_d_idx`(`userId`, `challengesParticipantsId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NutrientChallengeConditions` (
    `challengeId` INTEGER NOT NULL,
    `kcal` DOUBLE NULL,
    `carbohydrate` DOUBLE NULL,
    `protein` DOUBLE NULL,
    `fat` DOUBLE NULL,
    `natrium` DOUBLE NULL,
    `cholesterol` DOUBLE NULL,
    `sugar` DOUBLE NULL,

    PRIMARY KEY (`challengeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChallengesParticipants` ADD CONSTRAINT `ChallengesParticipants_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeCertificationLogs` ADD CONSTRAINT `ChallengeCertificationLogs_challengesParticipantsId_fkey` FOREIGN KEY (`challengesParticipantsId`) REFERENCES `ChallengesParticipants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NutrientChallengeConditions` ADD CONSTRAINT `NutrientChallengeConditions_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
