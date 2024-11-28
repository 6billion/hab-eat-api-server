/*
  Warnings:

  - You are about to drop the column `endDate` on the `Challenges` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Challenges` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,startDate,challengeId]` on the table `ChallengeParticipants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ChallengeParticipants_userId_challengeId_key` ON `ChallengeParticipants`;

-- DropIndex
DROP INDEX `ChallengeParticipants_userId_endDate_idx` ON `ChallengeParticipants`;

-- DropIndex
DROP INDEX `Challenges_startDate_endDate_idx` ON `Challenges`;

-- AlterTable
ALTER TABLE `Challenges` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`;

-- CreateIndex
CREATE UNIQUE INDEX `ChallengeParticipants_userId_startDate_challengeId_key` ON `ChallengeParticipants`(`userId`, `startDate`, `challengeId`);
