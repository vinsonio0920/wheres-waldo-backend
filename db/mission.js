import { prisma } from "../lib/prisma.js";

async function getAllMissionsQuery(cursor) {
  let missions;
  if (cursor) {
    missions = await prisma.mission.findMany({
      take: 10,
      skip: 1,
      cursor: {
        id: Number(cursor),
      },
      include: {
        targets: true,
      },
    });
  } else {
    // No take for now as there's no need for pagination currently
    // But it could be easily implemented if needed in the future!
    missions = await prisma.mission.findMany({
      // take: 10,
      include: {
        targets: true,
      },
    });
  }

  const missionLength = await prisma.mission.count();

  return { missions, missionLength };
}

async function getMissionQuery(missionId) {
  const mission = await prisma.mission.findUnique({
    where: {
      id: Number(missionId),
    },
    include: {
      targets: true,
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

async function getAllLeaderboardEntriesQuery(missionId, cursor) {
  let leaderboardEntries;
  if (cursor) {
    leaderboardEntries = await prisma.leaderboardEntry.findMany({
      take: 10,
      skip: 1,
      cursor: {
        id: Number(cursor),
      },
      where: {
        missionId: Number(missionId),
      },
      orderBy: [{ time: "asc" }, { id: "asc" }],
    });
  } else {
    leaderboardEntries = await prisma.leaderboardEntry.findMany({
      take: 10,
      where: {
        missionId: Number(missionId),
      },
      orderBy: [{ time: "asc" }, { id: "asc" }],
    });
  }

  const leaderboardEntriesLength = await prisma.leaderboardEntry.count({
    where: {
      missionId: Number(missionId),
    },
  });

  return { leaderboardEntries, leaderboardEntriesLength };
}

async function getLeaderboardRankQuery(missionId, timeTaken) {
  // note that the count includes every duplicate time as well!
  const entriesAhead = await prisma.leaderboardEntry.count({
    where: {
      missionId: Number(missionId),
      time: {
        lte: Number(timeTaken),
      },
    },
  });

  // we add an extra number to the entriesAhead because our leaderboard orders by
  // both time and id, meaning that the same time with newer id will naturally
  // be the last in the rank!
  return entriesAhead + 1;
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
  getLeaderboardRankQuery,
  createLeaderboardEntryQuery,
};
