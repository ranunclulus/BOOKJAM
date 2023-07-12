import express from "express";
import placesController from "./placesController";

const placesRouter = express.Router();

placesRouter.get("/", placesController.searchPlaces);

export default placesRouter;
