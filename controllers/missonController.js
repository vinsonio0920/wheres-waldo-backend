import {
  getAllLeaderboardEntriesQuery,
  getAllMissionsQuery,
  getMissionQuery,
  getTargetQuery,
} from "../db/Mission.js";

async function getAllMissions(req, res) {
  try {
    const missions = await getAllMissionsQuery();

    return res.json({
      data: {
        updated: new Date(),
        totalItems: 1,
        startIndex: 1,
        itemsPerPage: 1,
        items: missions,
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      error: {
        code: 500,
        message:
          "There was an error fetching the missions. Please try again later.",
      },
    });
  }
}

async function getMission(req, res) {
  const { missionId } = req.params;

  try {
    const mission = await getMissionQuery(missionId);

    return res.json({
      data: {
        updated: new Date(),
        totalItems: 1,
        startIndex: 1,
        itemsPerPage: 1,
        items: [mission],
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      error: {
        code: 500,
        message:
          "There was an error fetching the mission. Please try again later.",
      },
    });
  }
}

async function createMission(req, res) {}

async function getTarget(req, res) {
  const { missionId, targetId } = req.params;

  try {
    const target = await getTargetQuery(missionId, targetId);

    return res.json({
      data: {
        updated: new Date(),
        totalItems: 1,
        startIndex: 1,
        itemsPerPage: 1,
        items: [target],
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      error: {
        code: 500,
        message:
          "There was an error validating the target. Please try again later.",
      },
    });
  }
}

async function getAllLeaderboardEntries(req, res) {
  const { missionId } = req.params;

  try {
    const leaderboardEntries = await getAllLeaderboardEntriesQuery(missionId);

    return res.json({
      data: {
        totalItems: 1,
        startIndex: 1,
        itemsPerPage: 10,
        items: leaderboardEntries || [],
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      error: {
        code: 500,
        message:
          "There was an error fetching the leaderboard. Please try again later.",
      },
    });
  }
}

async function createLeaderboardEntry(req, res) {}

export {
  getAllMissions,
  getMission,
  createMission,
  getTarget,
  getAllLeaderboardEntries,
  createLeaderboardEntry,
};
