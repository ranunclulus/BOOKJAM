import express from "express";
import activitiesController from "./activitiesController";

const activitiesRouter = express.Router();

activitiesRouter.get("/:activityId(\\d+)", activitiesController.getActivityByActivityId);
activitiesRouter.post("/:activityId(\\d+)/likes", activitiesController.postLike);

export default activitiesRouter;
