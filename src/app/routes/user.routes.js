import { Router } from "express";
import { verifyJWToken } from "../middleware/authJwt.js";
import { verifyAuthTokenRevoke } from "../middleware/verifyAuthTokenRevoke.js";
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

userRouter.post(
  "/api/users",
  [verifyJWToken, verifyAuthTokenRevoke],
  createUser
);

userRouter.get("/api/users", [verifyJWToken, verifyAuthTokenRevoke], getUsers);

userRouter.get(
  "/api/users/:id",
  [verifyJWToken, verifyAuthTokenRevoke],
  getUserById
);

userRouter.patch(
  "/api/users",
  [verifyJWToken, verifyAuthTokenRevoke],
  updateUser
);

userRouter.delete(
  "/api/users/:id",
  [verifyJWToken, verifyAuthTokenRevoke],
  deleteUser
);
