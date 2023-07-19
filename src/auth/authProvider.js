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

    console.log(friendsResult);
    return friendsResult;
  }
};

export default authProvider;
