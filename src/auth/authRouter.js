import express from "express";
import authController from "./authController";

const authRouter = express.Router();

authRouter.post("/email-check", authController.checkEmailTaken);

authRouter.get("/friends", authController.recommandFriends);

export default authRouter;
