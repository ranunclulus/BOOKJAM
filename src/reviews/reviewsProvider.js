import pool from "../../config/database";
import reviewsDao from "./reviewsDao";

const reviewsProvider = {
  findReviewById: async (reviewId) => {
    const connection = await pool.getConnection();

    const review = await reviewsDao.selectReviewById(reviewId, connection);

    connection.release();

    return review;
  },
};

export default reviewsProvider;
