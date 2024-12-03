-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL,
    `hight` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `goalKcal` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('Google', 'Facebook', 'Local') NOT NULL,
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

-- AddForeignKey
ALTER TABLE `Accounts` ADD CONSTRAINT `Accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diets` (
    `id` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `date`  DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
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
    PRIMARY KEY (`id`)
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Foods` (   
    `name` VARCHAR(255) NOT NULL UNIQUE,  
    `amount` FLOAT,                       
    `kcal` FLOAT,                         
    `carbohydrate` FLOAT,                 
    `sugar` FLOAT,                        
    `fat` FLOAT,                          
    `protein` FLOAT,                      
    `calcium` FLOAT,                      
    `phosphorus` FLOAT,                   
    `natrium` FLOAT,                      
    `kalium` FLOAT,                       
    `magnesium` FLOAT,                    
    `iron` FLOAT,                         
    `zinc` FLOAT,                         
    `cholesterol` FLOAT,                  
    `transfat` FLOAT,                     
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
