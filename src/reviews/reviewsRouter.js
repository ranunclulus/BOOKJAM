import express from "express";
import reviewsController from "./reviewsController";
import middlewares from "../../config/middlewares";

const reviewsRouter = express.Router();

reviewsRouter.delete("/:reviewId(\\d+)", reviewsController.deleteReview);
reviewsRouter.post("/:reviewId(\\d+)/images", middlewares.s3Upload.array("images", 5), reviewsController.postImages);

export default reviewsRouter;
