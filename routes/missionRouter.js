import { Router } from "express";
import {
  createLeaderboardEntry,
  createMission,
  getAllLeaderboardEntries,
  getAllMissions,
  getMission,
  getTarget,
} from "../controllers/missonController.js";

const missionRouter = Router();

missionRouter.get("/", getAllMissions);
missionRouter.post("/", createMission);
missionRouter.get("/:missionId", getMission);
missionRouter.get("/:missionId/targets/:targetId", getTarget);
missionRouter.get("/:missionId/leaderboard", getAllLeaderboardEntries);
missionRouter.post("/:missionId/leaderboard", createLeaderboardEntry);

export { missionRouter };
