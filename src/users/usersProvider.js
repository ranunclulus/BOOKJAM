import pool from "../../config/database";
import usersDao from "./usersDao";
import logger from "../../config/logger";

const usersProvider = {
  getRecordsByUserId: async (userId, last, category) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const recordsResult = await usersDao.selectRecordsByUserId(connection, userId, last, category);
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
      logger.error(error.message);
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
      logger.error(error.message);
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

  checkOwner: async (userId, recordId) => {
    const connection = await pool.getConnection();

    const author = await usersDao.checkOwner(userId, recordId, connection);

    return author === userId;
  },

  getRecord: async (recordId) => {
    try {
      const connection = await pool.getConnection();
      const result = await usersDao.getRecord(recordId, connection);
      return result;
    } catch (error) {
      return { error: true };
    }
  },

  getMyReviews: async (userId, last) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const userReviews = await usersDao.selectMyReviews(connection, userId, last);
      connection.release();
      if (userReviews.error) return { error: true };
      return { userReviews: userReviews };
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  getMyActivities: async (userId, last) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const userActivities = await usersDao.selectMyActivities(connection, userId, last);
      connection.release();
      if (userActivities.error) return { error: true };
      return { userActivities: userActivities };
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  checkFollow: async (follower, followee) => {
    const connection = await pool.getConnection();

    const [result] = await usersDao.checkFollow(follower, followee, connection);

    return result ? true : false;
  },
};

export default usersProvider;
