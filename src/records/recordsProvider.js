import pool from "../../config/database";
import recordsDao from "./recordsDao";
import logger from "../../config/logger";
const recordsProvider = {
  getRecordsByUserId: async (userId, friendId, last) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const recordsResult = await recordsDao.selectRecordsByFriendId(connection, userId, friendId, last);
      connection.release();
      if (recordsResult.error) return { error: true };

      for (let i = 0; i < recordsResult.length; i++) {
        if (recordsResult[i].images_url) recordsResult[i].images_url = recordsResult[i].images_url.split("|");
      }
      return recordsResult;
    } catch (err) {
      logger.error(error.message);
      return { error: true };
    }
  },

  getRecordsAll: async (userId, last) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const recordsResult = await recordsDao.selectRecordsAll(connection, userId, last);
      connection.release();
      if (recordsResult.error) return { error: true };
      for (let i = 0; i < recordsResult.length; i++) {
        if (recordsResult[i].images_url) recordsResult[i].images_url = recordsResult[i].images_url.split("|");
      }
      return recordsResult;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  checkFollow: async (userId, friendId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const chk = await recordsDao.checkFollow(connection, userId, friendId);
      connection.release();
      if (chk.error) return { error: true };
      return chk;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  checkUser: async (userId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const chk = await recordsDao.checkUser(connection, userId);
      connection.release();
      if (chk === 0 || chk.error) {
        console.log(chk);
        return { error: true };
      }
      return chk;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  checkRecord: async (recordId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const result = await recordsDao.checkRecord(connection, recordId);
      connection.release();
      if (result.error) return { error: true };
      return result;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  checkComment: async (commentId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const result = await recordsDao.checkComment(connection, commentId);
      connection.release();
      if (result.error) return { error: true };
      return result;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  checkOwner: async (userId, commentId) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const result = await recordsDao.checkOwner(connection, userId, commentId);
      connection.release();
      if (result.error) return { error: true };
      if (result === 0) return { owner : false};
      return { owner : true };
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },
};

export default recordsProvider;
