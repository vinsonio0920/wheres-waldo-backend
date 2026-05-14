import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Welcome to the backend!"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`App running on port ${PORT}`);
});
