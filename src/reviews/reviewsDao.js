const reviewsDao = {
  selectReviewById: async (reviewId, connection) => {
    const sql = `
      select review_id
      from place_reviews
      where review_id = ${reviewId}
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  deleteReview: async (reviewId, connection) => {
    const sql = `
      delete from place_reviews
      where review_id = ${reviewId}        
    `;

    try {
      await connection.beginTransaction();

      await connection.query(sql);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.log(error);
    }
  },
  insertReviewImages: async (reviewId, images, connection) => {
    try {
      const imageValues = images.map(({ location }) => [reviewId, location]);

      const sql = `
        insert into place_review_images(review_id, image_url)
        values ?
      `;

      await connection.beginTransaction();

      await connection.query(sql, [imageValues]);

      await connection.commit();
    } catch (error) {
      console.log(error);
      await connection.rollback();
    }
  },
};

export default reviewsDao;
