import { Router } from "express";
import { commonRouter } from "./common.routes.js";
import { authRouter } from "./auth.routes.js";
import { adminRouter } from "./admin.routes.js";
import { userRouter } from "./user.routes.js";

export const router = Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

router.use(commonRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(userRouter);
