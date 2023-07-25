import pool from "../../config/database";
import usersDao from "./usersDao";

const usersService = {
  patchUsername: async (userId, username) => {
    try {
      const connection = await pool.getConnection();
      const result = await usersDao.updateUsername(connection, userId, username);
      connection.release();
      if (result.error) return { error: true };
      return { changed: true };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  },

  patchPassword: async (userId, password) => {
    try {
      const connection = await pool.getConnection();
      const result = await usersDao.updatePassword(connection, userId, password);
      connection.release();
      if (result.error) return { error: true };
      return { changed: true };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  },

  patchProfile: async (userId, profileImg) => {
    try {
      const connection = await pool.getConnection();
      const result = await usersDao.updateProfile(connection, userId, profileImg);
      connection.release();
      if (result.error) return { error: true };
      return { changed: true };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  },

  patchDisabled: async (userId) => {
    try {
      const connection = await pool.getConnection();
      const result = await usersDao.updateDisabled(connection, userId);
      connection.release();
      if (result.error) return { error: true };
      return { disabled: true };
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
};

export default usersService;
