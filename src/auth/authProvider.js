import pool from "../../config/database";
import authDao from "./authDao";

const authProvider = {
  checkEmailTaken: async (email) => {
    const connection = await pool.getConnection();

    const checkResult = await authDao.selectUserByEmail(email, connection);

    if (!checkResult) {
      return false;
    }

    return true;
  },

  recommandFriends: async () => {
    const connection = await pool.getConnection();

    const friendsResult = await authDao.selectThreeRandomUsers(connection);

    return friendsResult;
  },

  checkEmail: async (email) => {
    const connection = await pool.getConnection();

    const checkResult = await authDao.selectUserEmailByEmail(email, connection);

    if (!checkResult) {
      return false;
    }

    return checkResult;
  },

  checkPassword: async (selectUserPasswordParams) => {
    const connection = await pool.getConnection();

    const checkResult = await authDao.selectUserPassword(connection, selectUserPasswordParams);
    if (!checkResult) {
      return false;
    }

    return checkResult;
  },

  accountCheck: async (email) => {
    const connection = await pool.getConnection();
    const checkResult = await authDao.selectUserAllInfoByEmail(email, connection);
    if (!checkResult) {
      return false;
    }
    return checkResult;
  },

  saveRefresh: async (userId, refreshToken) => {
    try {
      const connection = await pool.getConnection();
      const result = await authDao.updateUserRefreshToken(userId, refreshToken, connection);
      connection.release()
      if (result.error)
        return {error: true}
      return {changed: true};
    } catch (error) {
      console.error(error);
      return {error: true}
    }
  }
};

export default authProvider;
