import "dotenv/config";
import express from "express";
import { missionRouter } from "./routes/missionRouter.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/missions", missionRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`App running on port ${PORT}`);
});
