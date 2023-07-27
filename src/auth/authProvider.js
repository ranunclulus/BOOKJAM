import pool from "../../config/database";
import logger from "../../config/logger";
import authDao from "./authDao";

const authProvider = {
  checkEmailTaken: async (email) => {
    const connection = await pool.getConnection();

    const [checkResult] = await authDao.selectUserByEmail(email, connection);

    connection.release();

    if (!checkResult) {
      return false;
    }

    return true;
  },

  recommendFriends: async () => {
    const connection = await pool.getConnection();

    const friendsResult = await authDao.selectThreeRandomUsers(connection);

    connection.release();

    return friendsResult;
  },

  findUserByEmail: async (email) => {
    const connection = await pool.getConnection();

    const [user] = await authDao.selectUserByEmail(email, connection);

    return user;
  },

  checkPassword: async (selectUserPasswordParams) => {
    const connection = await pool.getConnection();

    const checkResult = await authDao.selectUserPassword(connection, selectUserPasswordParams);
    if (!checkResult) {
      return false;
    }

    return checkResult;
  },

  saveRefresh: async (userId, refreshToken) => {
    try {
      const connection = await pool.getConnection();

      const result = await authDao.updateUserRefreshToken(userId, refreshToken, connection);

      connection.release();

      if (result.error) return { error: true };

      return { error: false, changed: true };
    } catch (error) {
      logger.error(error);
      return { error: true };
    }
  },

  getRefreshToken: async (userId) => {
    const connection = await pool.getConnection();

    const [{ refreshToken }] = await authDao.selectRefreshToken(userId, connection);

    connection.release();

    return refreshToken;
  },
};

export default authProvider;
