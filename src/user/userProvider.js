import pool from "../../config/database";
import userDao from "./userDao";

const userProvider = {
    postRecord: async (recordData, images_url) => {
        try {
            const connection = await pool.getConnection();
            const record = await userDao.insertRecord(connection, recordData, images_url);
            connection.release();
            return record;
        } catch (error) {
            return {error: true}
        }
    },
}

export default userProvider;