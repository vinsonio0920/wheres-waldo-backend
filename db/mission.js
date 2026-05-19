import { prisma } from "../lib/prisma.js";

async function getAllMissionsQuery() {
  const missions = await prisma.mission.findMany({
    include: {
      targets: true,
    },
  });

  return missions;
}

async function getMissionQuery(missionId) {
  const mission = await prisma.mission.findUnique({
    where: {
      id: Number(missionId),
    },
    include: {
      targets: true,
      leaderboard: true,
    },
  });

  return mission;
}

async function createMissionQuery(values) {
  const mission = await prisma.mission.create({
    data: values,
  });

  return mission;
}

async function getTargetQuery(missionId, targetId) {
  const target = await prisma.target.findUnique({
    where: {
      id: Number(targetId),
      missionId: Number(missionId),
    },
  });

  return target;
}

async function createTargetQuery(values) {
  const target = await prisma.target.create({
    data: values,
  });

  return target;
}

async function getAllLeaderboardEntriesQuery(missionId) {
  const leaderboardEntries = await prisma.leaderboardEntry.findMany({
    where: {
      id: Number(missionId),
    },
  });

  return leaderboardEntries;
}

async function createLeaderboardEntryQuery(values) {
  const leaderboardEntry = await prisma.leaderboardEntry.create({
    data: values,
  });

  return leaderboardEntry;
}

export {
  getAllMissionsQuery,
  getMissionQuery,
  createMissionQuery,
  getTargetQuery,
  createTargetQuery,
  getAllLeaderboardEntriesQuery,
  createLeaderboardEntryQuery,
};
