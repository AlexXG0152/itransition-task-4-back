import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import { db } from "./src/app/models/index.js";

import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./src/environments/.env" });
}

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
// app.use(express.static("assets"));
app.use(
  cookieSession({
    name: "itransition-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true });
    app.listen(PORT, () => {
      console.log(`\nServer is running on port ${PORT}.\n`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
