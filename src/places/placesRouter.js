import express from "express";
import placesController from "./placesController";
import middlewares from "../../config/middlewares";

const placesRouter = express.Router();

placesRouter.get("/", placesController.getPlaces);
placesRouter.get("/search", placesController.searchPlaces);
placesRouter.get("/:placeId(\\d+)/reviews", placesController.getReviews);
placesRouter.post("/:placeId(\\d+)/reviews", placesController.postReview);
placesRouter.get("/:placeId(\\d+)/activities", placesController.getActivities);
export default placesRouter;
