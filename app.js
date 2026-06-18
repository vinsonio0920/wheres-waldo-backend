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
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

app.use("/missions", missionRouter);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).send("Internal Server Error.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`App running on port ${PORT}`);
});
