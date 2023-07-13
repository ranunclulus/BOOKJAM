import express from "express";
import placesController from "./placesController";

const placesRouter = express.Router();

placesRouter.get("/", placesController.searchPlaces);
placesRouter.get("/:placeId(\\d+)/reviews", placesController.getReviews);

export default placesRouter;
