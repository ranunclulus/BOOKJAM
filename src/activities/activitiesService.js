import pool from "../../config/database";
import activitiesDao from "./activitiesDao";

const activitiesService = {
  postLike: async (activityId, userId) => {
    const connection = await pool.getConnection();

    const result = await activitiesDao.insertLike(activityId, userId, connection);

    connection.release();

    return result;
  },
};

export default activitiesService;
