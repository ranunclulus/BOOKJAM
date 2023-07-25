import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import pool from "../../config/database";
import reviewsDao from "./reviewsDao";
import reviewsProvider from "./reviewsProvider";
import s3 from "../../config/s3";
import logger from "../../config/logger";

const reviewsService = {
  deleteReview: async (reviewId) => {
    const connection = await pool.getConnection();

    const images = await reviewsDao.selectReviewImages(reviewId, connection);

    if (images.length > 0) {
      const command = new DeleteObjectsCommand({
        Bucket: "bookjam-bucket",
        Delete: {
          Objects: images.map(({ imageUrl }) => ({ Key: imageUrl.split("https://bookjam-bucket.s3.ap-northeast-2.amazonaws.com/")[1] })),
        },
      });

      try {
        const { Deleted } = await s3.send(command);
        logger.info(`Deleted ${Deleted.map((d) => d.Key)}`);
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
