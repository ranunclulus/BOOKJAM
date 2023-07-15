import express from "express";
import authController from "./authController";

const authRouter = express.Router();

authRouter.post("/email-check", authController.checkEmailTaken);

export default authRouter;
