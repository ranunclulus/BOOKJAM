import pool from "../../config/database";
import reviewsDao from "./reviewsDao";

const reviewsProvider = {
  findReviewById: async (reviewId) => {
    const connection = await pool.getConnection();

    const [review] = await reviewsDao.selectReviewById(reviewId, connection);

    connection.release();

    return review;
  },
  checkOwner: async (userId, reviewId) => {
    const connection = await pool.getConnection();

    const [{ author }] = await reviewsDao.selectReviewById(reviewId, connection);
    console.log(author);

    return author === userId;
  },
};

export default reviewsProvider;
