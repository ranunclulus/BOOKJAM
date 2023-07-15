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
};

export default authProvider;
