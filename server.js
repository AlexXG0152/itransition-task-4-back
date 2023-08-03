import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import { router } from "./src/app/routes/index.js";
import { db } from "./src/app/models/index.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./src/environments/.env" });
}

const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
// app.use(express.static("assets"));
// app.use(
//   cookieSession({
//     name: "itransition-session",
//     keys: [process.env.COOKIE_SECRET],
//     httpOnly: true,
//     secure: true,
//   })
// );
app.use(router);

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true });
    app.listen(PORT, () => {
      console.log(`\nServer is running on port ${PORT}.\n`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
