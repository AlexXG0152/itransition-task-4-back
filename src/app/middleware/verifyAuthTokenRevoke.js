import { db } from "../models/index.js";

const AuthToken = db.AuthToken;

export const verifyAuthTokenRevoke = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  try {
    let isTokenActive = await AuthToken.findOne({
      where: {
        token: token,
      },
    });

    if (!isTokenActive) {
      return res.status(400).send({
        message: "Sign in again!",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Unable to validate token!",
    });
  }
};
