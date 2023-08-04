import { Router } from "express";

export const commonRouter = Router();

commonRouter.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

commonRouter.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});
