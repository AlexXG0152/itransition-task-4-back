import { Router } from "express";
import { checkDuplicateUsernameOrEmail } from "../middleware/verifySignUpData.js";
import { verifyAuthTokenRevoke } from "../middleware/verifyAuthTokenRevoke.js";
import { verifyJWToken } from "../middleware/authJwt.js";
import {
  signup,
  signin,
  signout,
  refreshToken,
} from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

authRouter.post("/api/auth/signup", [checkDuplicateUsernameOrEmail], signup);

authRouter.post("/api/auth/signin", signin);

authRouter.post(
  "/api/auth/signout",
  [verifyJWToken, verifyAuthTokenRevoke],
  signout
);

authRouter.post("/api/auth/refreshtoken", refreshToken);
