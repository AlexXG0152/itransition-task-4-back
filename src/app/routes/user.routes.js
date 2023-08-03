import { Router } from "express";
import { verifyJWToken } from "../middleware/authJwt.js";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  next(); 
});

userRouter.post("/api/users", [verifyJWToken], createUser);
userRouter.get("/api/users", [verifyJWToken], getUsers);
userRouter.get("/api/users/:id", [verifyJWToken], getUserById);
userRouter.put("/api/users/:id", [verifyJWToken], updateUser);
userRouter.delete("/api/users/:id", [verifyJWToken], deleteUser);
