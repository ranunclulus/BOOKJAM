import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import reviewsService from "./reviewsService";

const reviewsController = {
  deleteReview: async (req, res) => {
    try {
      const {
        params: { reviewId },
      } = req;

      const deleteResult = await reviewsService.deleteReview(reviewId);

      if (deleteResult.error) {
        return res.status(404).json(response(baseResponse.REVIEW_NOT_FOUND));
      }

      return res.status(200).json(response(baseResponse.SUCCESS, deleteResult.result));
    } catch (error) {
      console.log(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  postImages: async (req, res) => {
    try {
      const {
        params: { reviewId },
      } = req;
      const images = req.files.map(({ location, key }) => ({ location, key }));

      const insertResult = await reviewsService.addReviewImages(reviewId, images);

      if (insertResult.error) {
        return res.status(400).json(response(baseResponse.PLACE_NOT_FOUND));
      }

      return res.status(201).json(response(baseResponse.SUCCESS, insertResult.result));
    } catch (error) {
      console.log(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
};

export default reviewsController;
