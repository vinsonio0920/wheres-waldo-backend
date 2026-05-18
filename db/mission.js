import { prisma } from "../lib/prisma.js";

async function getAllMissionsQuery() {
  const missions = await prisma.mission.findMany();

  return missions;
}

async function getMissionQuery(missionId) {
  const mission = await prisma.mission.findUnique({
    where: {
      id: Number(missionId),
    },
  });

  return mission;
}

async function createMissionQuery() {}

async function getTargetQuery(missionId, targetId) {
  const target = await prisma.target.findUnique({
    where: {
      id: Number(targetId),
      missionId: Number(missionId),
    },
  });

  return target;
}

async function getAllLeaderboardEntriesQuery(missionId) {
  const leaderboardEntries = await prisma.leaderboardEntry.findMany({
    where: {
      id: Number(missionId),
    },
  });
}

async function createLeaderboardEntryQuery() {}

export {
  getAllMissionsQuery,
  getMissionQuery,
  createMissionQuery,
  getTargetQuery,
  getAllLeaderboardEntriesQuery,
  createLeaderboardEntryQuery,
};
