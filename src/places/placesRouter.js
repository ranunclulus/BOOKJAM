import express from "express";
import placesController from "./placesController";

const placesRouter = express.Router();

placesRouter.get("/", placesController.getPlaces);
placesRouter.get("/search", placesController.searchPlaces);
placesRouter.get("/:placeId(\\d+)/reviews", placesController.getReviews);

export default placesRouter;
