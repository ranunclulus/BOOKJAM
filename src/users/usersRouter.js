import express from "express";
import usersController from "./usersController";
import middlewares from "../../config/middlewares";

const usersRouter = express.Router();

usersRouter.get("/records", usersController.getRecordsByUserId);
usersRouter.get("/outline", usersController.getMyPage);
usersRouter.post("/:userId(\\d+)/following", usersController.postFollowing);
usersRouter.patch("/username", usersController.patchUsername);
usersRouter.patch("/password", usersController.patchPassword);
usersRouter.patch("/profile", middlewares.s3Upload.single("images"), usersController.patchProfile);
usersRouter.patch("/disabled", usersController.patchDisabled);
usersRouter.delete("/:userId(\\d+)/following/:targetUserId(\\d+)", usersController.deleteFollowing);
usersRouter.get("/record/:recordId", usersController.getRecordForUpdate);
usersRouter.get("/activities", usersController.getMyActivities);
usersRouter.get("/reviews", usersController.getMyReviews)

export default usersRouter;
