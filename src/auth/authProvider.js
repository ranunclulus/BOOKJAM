import pool from "../../config/database";
import authDao from "./authDao";

const authProvider = {
  checkEmailTaken: async (email) => {
    const connection = await pool.getConnection();

    const checkResult = await authDao.selectUserByEmail(email, connection);

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
};

export default authProvider;
