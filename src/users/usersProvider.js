import pool from "../../config/database";
import usersDao from "./usersDao";

const usersProvider = {
  getRecordsByUserId: async (userId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const recordsResult = await usersDao.selectRecordsByUserId(connection, userId);
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
      const activities = await usersDao.selectMypageActivities(connection, userId);
      const records = await usersDao.selectMypageRecords(connection, userId);
      const reviews = await usersDao.selectMypageReviews(connection, userId);
      connection.release();
      if (userOutline.error || activities.error || records.error || reviews.error) return { error: true };
      return { userOutline: userOutline, activities: activities, records: records, reviews: reviews };
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

  checkOwner: async (userId, recordId) => {
    const connection = await pool.getConnection();

    const author  = await usersDao.checkOwner(userId, recordId, connection);

    return author === userId;
  },

  getRecord: async (recordId) => {
    try{
      const connection = await pool.getConnection();
      const result = await usersDao.getRecord(recordId, connection);
      return result;
    }catch (error) {
      return {error: true};
    }
  },
};

export default usersProvider;
