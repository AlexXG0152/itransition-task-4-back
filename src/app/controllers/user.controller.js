import bcryptjs from "bcryptjs";
import { db } from "../models/index.js";
import { signout } from "./auth.controller.js";

const User = db.user;

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
    // const { id } = req.params;
    for (const item of req.body.data) {
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

      await user.save();

      // res.status(200).json(user);
    }
    return res.status(200).json({ message: "Done!" });
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
