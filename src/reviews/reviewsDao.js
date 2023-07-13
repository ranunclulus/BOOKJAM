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

      const [queryResult] = await connection.query(sql);
      console.log(queryResult);

      await connection.commit();

      return queryResult;
    } catch (error) {
      await connection.rollback();
      console.log(error);
    }
  },
};

export default reviewsDao;
