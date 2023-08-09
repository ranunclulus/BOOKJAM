import express from "express";
import authController from "./authController";

const authRouter = express.Router();

authRouter.get("/friends", authController.recommendFriends);

authRouter.get("/refresh", authController.refresh);

authRouter.post("/email-check", authController.checkEmailTaken);

authRouter.post("/sign-up", authController.signUp);

authRouter.post("/login", authController.login);

export default authRouter;
