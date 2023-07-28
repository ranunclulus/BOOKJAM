import pool from "../../config/database";
import jwt from "../../config/jwt";
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

  validateRefreshToken: async (token) => {
    const connection = await pool.getConnection();

    try {
      const { userId } = await jwt.verifyTokenAsync(token);

      const isTokenOnwer = (await authDao.selectRefreshToken(userId, connection)) === token;
      if (!isTokenOnwer) {
        logger.info(`Refresh Token: ${token} 사용자 ${userId}와(과) 불일치`);
        return { result: false, name: "NotOwnerError" };
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        logger.info(`Refresh Token: ${token} 기한 만료`);
        return { result: false, name: error.name };
      }
      logger.info(`${token} 인증 실패`);
      return { result: false, name: "VerificationError" };
    }

    connection.release();
    return { result: true };
  },
};

export default authProvider;
