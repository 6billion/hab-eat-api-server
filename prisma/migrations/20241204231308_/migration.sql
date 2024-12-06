/*
  Warnings:

  - The values [bulk,diet,protein2x] on the enum `ChallengeParticipants_challengeType` will be removed. If these variants are still used in the database, this will fail.
  - The values [bulk,diet,protein2x] on the enum `ChallengeParticipants_challengeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `ChallengeParticipants` MODIFY `challengeType` ENUM('nutriBulk', 'nutriDiet', 'nutriProtein2x', 'habit') NOT NULL;

-- AlterTable
ALTER TABLE `Challenges` MODIFY `type` ENUM('nutriBulk', 'nutriDiet', 'nutriProtein2x', 'habit') NOT NULL;
