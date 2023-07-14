import express from "express";
import activityController from "./activityController";


const activityRouter = express.Router();

activityRouter.get('(/places/activities/:activityId(\\d+))', activityController.getActivityByActivityId);
// /places/{placeId}/acrivities
activityRouter.get('(/places/:placeId(\\d+)/activities)', activityController.getActivitiesByPlaceId);

export default activityRouter;