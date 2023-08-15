import pool from "../../config/database";
import activitiesDao from "./activitiesDao";
import activitiesProvider from "./activitiesProvider";

const activitiesService = {
  postLike: async (activityId, userId) => {
    const connection = await pool.getConnection();

    const result = await activitiesDao.insertLike(activityId, userId, connection);

    connection.release();

    return result;
  },

  deleteLike: async (activityId, userId) => {
    const connection = await pool.getConnection();

    const activityExists = await activitiesProvider.retrieveActivityByActivityId(activityId);

    if (activityExists.error) {
      return { error: true, message: "ActivityNotFound" };
    }

    if (!(await activitiesProvider.isActivityLiked(activityId, userId))) {
      return { error: true, message: "ActivityNotLiked" };
    }

    const deleteResult = await activitiesDao.deleteLike(activityId, userId, connection);

    return deleteResult;
  },
};

export default activitiesService;
