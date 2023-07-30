import pool from "../../config/database";
import usersDao from "./usersDao";

const usersProvider = {
  getRecordsByUserId: async (userId, lastId, category) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const recordsResult = await usersDao.selectRecordsByUserId(connection, userId, lastId, category);
      connection.release();
      if (recordsResult.error) return { error: true };

      for (let i = 0; i < recordsResult.length; i++) {
        if (recordsResult[i].images_url) recordsResult[i].images_url = recordsResult[i].images_url.split("|");
      }
      return recordsResult;
    } catch (err) {
      return { error: true };
    }
  },

  checkUser: async (userId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const chk = await usersDao.checkUser(connection, userId);
      connection.release();
      if (chk.error) return 0;
      return chk;
    } catch (error) {
      console.error(error);
      return 0;
    }
  },

  getMyPage: async (userId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const userOutline = await usersDao.selectMypageUserOutline(connection, userId);
      connection.release();
      if (userOutline.error) return { error: true };
      return { userOutline: userOutline };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  },

  checkFollowExists: async (userId, targetUserId) => {
    const connection = await pool.getConnection();
    const [alreadyFollowed] = await usersDao.selectUserFollow(userId, targetUserId, connection);

    if (alreadyFollowed) {
      return true;
    }
    return false;
  },

  getMyReviews: async (userId, lastId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const userReviews = await usersDao.selectMyReviews(connection, userId, lastId);
      connection.release();
      if (userReviews.error) return { error: true };
      return { userReviews: userReviews };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  },

  getMyActivities: async (userId, lastId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const userActivities = await usersDao.selectMyActivities(connection, userId, lastId);
      connection.release();
      if (userActivities.error) return { error: true };
      return { userActivities: userActivities };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  },

};

export default usersProvider;
