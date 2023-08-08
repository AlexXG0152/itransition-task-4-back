import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./src/app/routes/index.js";
import { db } from "./src/app/models/index.js";

import { initial } from "./src/helpers/createAndFillDbWithMockData.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./src/environments/.env" });
}

const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = { credentials: true, origin: "http://localhost:4200" };

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(router);

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true });
    await initial(10);

    app.listen(PORT, () => {
      console.log(`\nServer is running on port ${PORT}.\n`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
