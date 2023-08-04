import { Router } from "express";
import { verifyJWToken } from "../middleware/authJwt.js";
import { verifyAuthTokenRevoke } from "../middleware/verifyAuthTokenRevoke.js";
import { adminBoard } from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  next();
});

adminRouter.get(
  "/api/adminBoard",
  [verifyJWToken, verifyAuthTokenRevoke],
  adminBoard
);
