import pool from "../../config/database";
import reviewsDao from "./reviewsDao";
import reviewsProvider from "./reviewsProvider";

const reviewsService = {
  deleteReview: async (reviewId) => {
    const connection = await pool.getConnection();

    const [review] = await reviewsProvider.findReviewById(reviewId);

    if (!review) {
      return { error: true };
    }

    await reviewsDao.deleteReview(reviewId, connection);

    return { error: false, result: { deleted: true } };
  },
  addReviewImages: async (reviewId, images) => {
    const connection = await pool.getConnection();

    const [review] = await reviewsProvider.findReviewById(reviewId);

    if (!review) {
      return { error: true };
    }

    await reviewsDao.insertReviewImages(reviewId, images, connection);

    connection.release();

    return { error: false, result: { uploaded: true } };
  },
};

export default reviewsService;
