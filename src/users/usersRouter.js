import express from "express";
import usersController from "./usersController";
import middlewares from "../../config/middlewares";

const usersRouter = express.Router();

usersRouter.get("/:userId(\\d+)/records", usersController.getRecordsByUserId);
usersRouter.get("/:userId(\\d+)", usersController.getMyPage);
usersRouter.post("/:userId(\\d+)/following", usersController.postFollowing);
usersRouter.patch("/:userId(\\d+)/username", usersController.patchUsername);
usersRouter.patch("/:userId(\\d+)/password", usersController.patchPassword);
usersRouter.patch("/:userId(\\d+)/profile", middlewares.s3Upload.single("images"), usersController.patchProfile);
usersRouter.patch("/:userId(\\d+)/disabled", usersController.patchDisabled);
usersRouter.delete("/:userId(\\d+)/following/:targetUserId(\\d+)", usersController.deleteFollowing);
usersRouter.get("/record/:recordId", usersController.getRecordForUpdate);

export default usersRouter;
