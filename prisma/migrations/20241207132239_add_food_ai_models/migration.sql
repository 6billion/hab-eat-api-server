-- CreateTable
CREATE TABLE `FoodAiModels` (
    `foodId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`foodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoodAiModels` ADD CONSTRAINT `FoodAiModels_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Foods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
