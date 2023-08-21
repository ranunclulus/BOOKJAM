import pool from "../../config/database";
import authDao from "./authDao";
import logger from "../../config/logger";

const authService = {
  createNewUser: async (user) => {
    try {
      const connection = await pool.getConnection();
      const newUserId = await authDao.insertUser(connection, user);
      if (!newUserId) {
        return { error: false };
      }

      connection.release();

      return newUserId;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },
};

export default authService;
