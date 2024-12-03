-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '햅잇',
    `height` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `sex` ENUM('male', 'felmale') NOT NULL,
    `type` ENUM('diet', 'bulk', 'maintain') NOT NULL,
    `activityLevel` ENUM('sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive') NOT NULL DEFAULT 'lightlyActive',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('kakao', 'naver') NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Accounts_userId_key`(`userId`),
    PRIMARY KEY (`id`, `type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tokens` (
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tokens_userId_key`(`userId`),
    UNIQUE INDEX `Tokens_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Challenges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `targetUserType` ENUM('diet', 'bulk', 'maintain') NOT NULL,
    `type` ENUM('bulk', 'diet', 'habit', 'protein2x') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChallengeParticipants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `challengeId` INTEGER NOT NULL,
    `challengeType` ENUM('bulk', 'diet', 'habit', 'protein2x') NOT NULL,
    `goalDays` INTEGER NOT NULL,
    `successDays` INTEGER NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `lastSuccessDate` DATE NULL,
    `lastCheckDate` DATE NULL,
    `status` BOOLEAN NOT NULL,

    UNIQUE INDEX `ChallengeParticipants_userId_startDate_challengeId_key`(`userId`, `startDate`, `challengeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChallengeCertificationLogs` (
    `userId` INTEGER NOT NULL,
    `challengeParticipantsId` INTEGER NOT NULL,
    `date` DATE NOT NULL,

    UNIQUE INDEX `ChallengeCertificationLogs_userId_challengeParticipantsId_da_key`(`userId`, `challengeParticipantsId`, `date`)
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

-- CreateTable
CREATE TABLE `ChallengeImageDetectionServerUrls` (
    `challengeId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`challengeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DietStats` (
    `userId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `amount` DOUBLE NOT NULL,
    `kcal` DOUBLE NOT NULL,
    `carbohydrate` DOUBLE NOT NULL,
    `sugar` DOUBLE NOT NULL,
    `fat` DOUBLE NOT NULL,
    `protein` DOUBLE NOT NULL,
    `calcium` DOUBLE NOT NULL,
    `phosphorus` DOUBLE NOT NULL,
    `natrium` DOUBLE NOT NULL,
    `kalium` DOUBLE NOT NULL,
    `magnesium` DOUBLE NOT NULL,
    `iron` DOUBLE NOT NULL,
    `zinc` DOUBLE NOT NULL,
    `cholesterol` DOUBLE NOT NULL,
    `transfat` DOUBLE NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`, `date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `amount` DOUBLE NOT NULL,
    `kcal` DOUBLE NOT NULL,
    `carbohydrate` DOUBLE NOT NULL,
    `sugar` DOUBLE NOT NULL,
    `fat` DOUBLE NOT NULL,
    `protein` DOUBLE NOT NULL,
    `calcium` DOUBLE NOT NULL,
    `phosphorus` DOUBLE NOT NULL,
    `natrium` DOUBLE NOT NULL,
    `kalium` DOUBLE NOT NULL,
    `magnesium` DOUBLE NOT NULL,
    `iron` DOUBLE NOT NULL,
    `zinc` DOUBLE NOT NULL,
    `cholesterol` DOUBLE NOT NULL,
    `transfat` DOUBLE NOT NULL,

    INDEX `Diets_userId_date_createdAt_idx`(`userId`, `date`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Foods` (
    `name` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `kcal` DOUBLE NOT NULL,
    `carbohydrate` DOUBLE NOT NULL,
    `sugar` DOUBLE NOT NULL,
    `fat` DOUBLE NOT NULL,
    `protein` DOUBLE NOT NULL,
    `calcium` DOUBLE NOT NULL,
    `phosphorus` DOUBLE NOT NULL,
    `natrium` DOUBLE NOT NULL,
    `kalium` DOUBLE NOT NULL,
    `magnesium` DOUBLE NOT NULL,
    `iron` DOUBLE NOT NULL,
    `zinc` DOUBLE NOT NULL,
    `cholesterol` DOUBLE NOT NULL,
    `transfat` DOUBLE NOT NULL,

    UNIQUE INDEX `Foods_name_key`(`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Accounts` ADD CONSTRAINT `Accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeParticipants` ADD CONSTRAINT `ChallengeParticipants_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeCertificationLogs` ADD CONSTRAINT `ChallengeCertificationLogs_challengeParticipantsId_fkey` FOREIGN KEY (`challengeParticipantsId`) REFERENCES `ChallengeParticipants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NutrientChallengeConditions` ADD CONSTRAINT `NutrientChallengeConditions_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeImageDetectionServerUrls` ADD CONSTRAINT `ChallengeImageDetectionServerUrls_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
