import { Router } from "express";

const missionRouter = Router();

missionRouter.get("/", (req, res) => res.send("Get all missions!"));
missionRouter.get("/:missionId", (req, res) => res.send("Get mission!"));
missionRouter.get("/:missionId/targets/:targetId", (req, res) =>
  res.send("Get target information!!"),
);
missionRouter.post("/:missionId/leaderboard", (req, res) =>
  res.send("Add entry to the leaderboard"),
);

export { missionRouter };
