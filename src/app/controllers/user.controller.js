import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../models/index.js";
import { signout } from "./auth.controller.js";

const User = db.user;
const AuthToken = db.AuthToken;
const RefreshToken = db.refreshToken;

export async function createUser(req, res) {
  try {
    const data = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 8),
      registrationDate: Date.now(),
      lastLoginDateDate: null,
      status: "active",
    });

    const { password, ...user } = data.dataValues;

    if (user) res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params || req.body.id;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const userID = await checkUserId(token);
    const foundID = req.body.data.find((i) => i.id === userID);

    for (const item of req.body.data) {
      await update(item);
    }

    const message =
      foundID && (foundID.status === "blocked" || foundID.status === "deleted")
        ? "User was blocked"
        : "Done!";

    return res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    await signout(req, res);

    // res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function update(item) {
  const { id, username, email, password, status } = item;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.username = username || user.username;
  user.email = email || user.email;
  if (password) {
    user.password = bcryptjs.hashSync(password, 8);
  }
  user.status = status || user.status;
  if (status === "blocked" || status === "deleted") {
    AuthToken.destroy({ where: { userId: user.id } });
    RefreshToken.destroy({ where: { userId: user.id } });
  }
  if (status === "deleted") {
    user.deleteDate = Date.now();
  }

  await user.save();
}

async function checkUserId(token) {
  return jsonwebtoken.verify(
    token,
    process.env.JSONWEBTOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      return decoded.id;
    }
  );
}
