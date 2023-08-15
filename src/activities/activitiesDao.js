import logger from "../../config/logger";

const activitiesDao = {
  selectActivityByActivityId: async (connection, activityId) => {
    const sql = `
            SELECT activity_id, created_at, title, info, capacity, headcount, total_rating, review_count, image_url, 
            (SELECT COUNT(*) FROM activity_likes WHERE activities.activity_id = activity_likes.activity_id) AS like_num 
            FROM activities
            WHERE activities.activity_id = ?
            `;
    const [queryActivity] = await connection.query(sql, activityId);
    return queryActivity;
  },
  insertLike: async (activityId, userId, connection) => {
    const sql = `
      insert into activity_likes(activity_id, liker)
      values (${activityId}, ${userId})
    `;

    try {
      await connection.beginTransaction();

      const { insertId } = await connection.query(sql);

      await connection.commit();

      return { error: false, insertId };
    } catch (error) {
      await connection.rollback();
      logger.error(error);
      return { error: true };
    }
  },
};

export default activitiesDao;
