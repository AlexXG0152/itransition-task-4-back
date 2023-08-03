import bcryptjs from "bcryptjs";
import { db } from "../models/index.js";
import { signout } from "./auth.controller.js";

const User = db.user;
const RefreshToken = db.refreshToken;

export async function createUser(req, res) {
  try {
    const data = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 8),
      registrationDate: Date.now(),
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
        exclude: ["password"],
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
        exclude: ["password"],
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
    const { id } = req.params;
    const { username, email, password, registrationDate, status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.email = email;
    user.password = bcryptjs.hashSync(password, 8);
    user.registrationDate = user.registrationDate;
    user.status = status;

    await user.save();

    user.password = "";

    res.status(200).json(user);
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

    await signout(req, res)

    // res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
