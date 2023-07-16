import express from "express";
import placesController from "./placesController";
import middlewares from "../../config/middlewares";

const placesRouter = express.Router();

placesRouter.get("/search", placesController.searchPlaces);
placesRouter.get("/:placeId(\\d+)/reviews", placesController.getReviews);
placesRouter.post("/:placeId(\\d+)/reviews", middlewares.s3Upload.array("image", 5), placesController.postReview);

export default placesRouter;
