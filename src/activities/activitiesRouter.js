import express from "express";
import activitiesController from "./activitiesController";


const activitiesRouter = express.Router();

activitiesRouter.get('/:activityId(\\d+)', activitiesController.getActivityByActivityId);

export default activitiesRouter;