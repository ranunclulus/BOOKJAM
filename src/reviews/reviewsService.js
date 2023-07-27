import pool from "../../config/database";
import reviewsDao from "./reviewsDao";
import reviewsProvider from "./reviewsProvider";
import { deleteS3Images } from "../../config/s3";
import logger from "../../config/logger";

const reviewsService = {
  deleteReview: async (reviewId) => {
    const connection = await pool.getConnection();

    const images = await reviewsDao.selectReviewImages(reviewId, connection);

    if (images.length > 0) {
      try {
        const result = await deleteS3Images(images);
        logger.info(`Deleted ${result.map((r) => r.Key)}`);
      } catch (error) {
        logger.error(error.message);
        throw error;
      }
    }

    await reviewsDao.deleteReview(reviewId, connection);

    connection.release();

    return { error: false, deleted: true };
  },
  addReviewImages: async (reviewId, images) => {
    const connection = await pool.getConnection();

    const review = await reviewsProvider.findReviewById(reviewId);

    if (!review) {
      return { error: true };
    }

    await reviewsDao.insertReviewImages(reviewId, images, connection);

    connection.release();

    return { error: false, result: { uploaded: true } };
  },
};

export default reviewsService;
