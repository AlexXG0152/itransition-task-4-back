import { Sequelize } from "sequelize";
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./src/environments/.env" });
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: Number(process.env.DB_POOL_MAX),
      min: Number(process.env.DB_POOL_MIN),
      acquire: Number(process.env.DB_POOL_ACQUIRE),
      idle: Number(process.env.DB_POOL_IDLE),
    },
  }
);

export const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = User(sequelize, Sequelize);
db.refreshToken = RefreshToken(sequelize, Sequelize);

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});
