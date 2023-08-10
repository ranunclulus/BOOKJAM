import { getRegExp } from "korean-regexp";
import pool from "../../config/database";
import usersDao from "./usersDao";
import usersProvider from "./usersProvider";

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

  addFollower: async (userId, targetUserId) => {
    const connection = await pool.getConnection();

    const result = await usersDao.insertFollow(userId, targetUserId, connection);

    connection.release();

    return result;
  },

  deleteFollower: async (userId, targetUserId) => {
    const connection = await pool.getConnection();

    const result = await usersDao.deleteUserFollow(userId, targetUserId, connection);

    connection.release();

    return result;
  },

  searchUsers: async (keyword, userId) => {
    const connection = await pool.getConnection();

    const keywordRegexp = getRegExp(keyword).toString().slice(1, -2);

    let result = await usersDao.findUsersByKeyword(keywordRegexp, userId, connection);

    result = Promise.all(
      result.map(async (user) => {
        const { userId: targetUserId } = user;
        const following = await usersProvider.checkFollow(userId, targetUserId);

        return { ...user, following };
      })
    );

    return result;
  },
};

export default usersService;
