import { Router } from "express";
import {
  createLeaderboardEntry,
  createMission,
  getAllMissions,
  getMission,
  getTarget,
} from "../controllers/missonController";

const missionRouter = Router();

missionRouter.get("/", getAllMissions);
missionRouter.post("/", createMission);
missionRouter.get("/:missionId", getMission);
missionRouter.get("/:missionId/targets/:targetId", getTarget);
missionRouter.post("/:missionId/leaderboard", createLeaderboardEntry);

export { missionRouter };
