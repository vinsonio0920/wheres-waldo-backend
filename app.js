import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";
import { missionRouter } from "./routes/missionRouter.js";

const app = express();

app.use(
  session({
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, //ms,
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/missions", missionRouter);
app.get("/test", async (req, res) => {
  console.log("before save:", req.sessionID);

  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  console.log("after save");

  const byId = await prisma.session.findUnique({
    where: {
      id: req.sessionID,
    },
  });

  console.log(byId);

  res.json({
    sessionID: req.sessionID,
    byId,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`App running on port ${PORT}`);
});
