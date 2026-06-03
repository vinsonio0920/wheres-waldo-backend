/*
  Warnings:

  - You are about to alter the column `time` on the `LeaderboardEntry` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "LeaderboardEntry" ALTER COLUMN "time" SET DATA TYPE INTEGER;
