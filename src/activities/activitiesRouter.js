import express from "express";
import activitiesController from "./activitiesController";
import activitiesService from "./activitiesService";

const activitiesRouter = express.Router();

activitiesRouter.get("/:activityId(\\d+)", activitiesController.getActivityByActivityId);
activitiesRouter.post("/:activityId(\\d+)/likes", activitiesController.postLike);
activitiesRouter.delete("/:activityId(\\d+)/likes", activitiesController.deleteLike);

export default activitiesRouter;
