import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { db } from "../models/index.js";
import { createUser, updateUser } from "../controllers/user.controller.js";

const User = db.user;
const AuthToken = db.AuthToken;
const RefreshToken = db.refreshToken;

export async function signup(req, res) {
  try {
    await createUser(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
}

export async function signin(req, res) {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) return res.status(404).send({ message: "User Not found." });

    const passwordIsValid = bcryptjs.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jsonwebtoken.sign(
      { id: user.id },
      process.env.JSONWEBTOKEN_SECRET,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: Number(process.env.JSONWEBTOKEN_EXPIRATION),
      }
    );

    await AuthToken.writeToken(user.id, token);
    let refreshToken = await RefreshToken.createToken(user);

    const userForUpdate = await User.findByPk(user.id);
    userForUpdate.lastLoginDate = Date.now();
    await userForUpdate.save()

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
}

export async function signout(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    AuthToken.destroy({ where: { token: token } });
    // RefreshToken.destroy({ where: { userId: userId } });

    req.session = null;

    return res.status(200).send({
      accessToken: "",
      refreshToken: "",
      message: "You've been signed out!",
    });
  } catch (error) {
    console.error(error);
    this.next(error);
  }
}

export async function refreshToken(req, res) {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await User.findByPk(refreshToken.dataValues.id);

    let newAccessToken = jsonwebtoken.sign(
      { id: user.id },
      process.env.JSONWEBTOKEN_SECRET,
      {
        expiresIn: Number(process.env.JSONWEBTOKEN_EXPIRATION),
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}
