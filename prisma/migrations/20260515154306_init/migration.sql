-- CreateTable
CREATE TABLE "Mission" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locations" JSONB NOT NULL,
    "sniped" BOOLEAN NOT NULL,
    "missionId" INTEGER NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "time" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "missionId" INTEGER NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
