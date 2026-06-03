/*
  Warnings:

  - A unique constraint covering the columns `[time,id]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_time_id_key" ON "LeaderboardEntry"("time", "id");
