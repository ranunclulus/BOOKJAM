import express from "express";
import reviewsController from "./reviewsController";

const reviewsRouter = express.Router();

reviewsRouter.delete("/:reviewId(\\d+)", reviewsController.deleteReview);

export default reviewsRouter;
