import pool from "../../config/database";
import activitiesDao from "./activitiesDao";

const activitiesProvider = {
  retrieveActivityByActivityId: async (activityId, userId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const [activityResult] = await activitiesDao.selectActivityByActivityId(connection, activityId);

      if (!activityResult) {
        return { error: true };
      }
      const liked = await activitiesProvider.checkUserLikedActivity(activityId, userId);

      connection.release();
      return {
        error: false,
        result: { ...activityResult, liked },
      };
    } catch (err) {
      return { error: true };
    }
  },

  checkUserLikedActivity: async (activityId, userId) => {
    const connection = await pool.getConnection();

    const [likeResult] = await activitiesDao.findLikeByActivityIdAndUserId(activityId, userId, connection);

    connection.release();

    return likeResult ? true : false;
  },
};

export default activitiesProvider;
