import { getLeaderboardRankQuery } from "./db/mission.js";
import { prisma } from "./lib/prisma.js";

function getTime(startTime) {
  // logic to return seconds/minutes/hours/days to find the target
  const currentTime = Date.now();
  const timeTaken = currentTime - startTime;

  let formattedTime;
  const numberFormat = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  if (timeTaken / day > 1) {
    // day
    formattedTime = `${numberFormat
      .format(timeTaken / day)
      .toString()
      .replace(/\./, ":")}d`;
  } else if (timeTaken / hour > 1) {
    // hour
    formattedTime = `${numberFormat
      .format(timeTaken / hour)
      .toString()
      .replace(/\./, ":")}h`;
  } else {
    // minutes/seconds
    if (timeTaken / minute > 1) {
      formattedTime = `${numberFormat
        .format(timeTaken / minute)
        .toString()
        .replace(/\./, ":")}m`;
    } else {
      formattedTime = `${numberFormat
        .format(timeTaken / minute)
        .toString()
        .replace(/\./, ":")}s`;
    }
  }

  return formattedTime;
}

async function getRank(missionId, startTime) {
  // gets the rank compared to the existing leaderboard entries
  const currentTime = Date.now();
  const timeTaken = currentTime - startTime;

  const rank = await getLeaderboardRankQuery(missionId, timeTaken);

  return rank;
}

export { getTime, getRank };
