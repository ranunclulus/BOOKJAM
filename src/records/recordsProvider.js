import pool from "../../config/database";
import recordsDao from "./recordsDao";

const recordsProvider = {
    postRecord: async (recordData, images_url) => {
        try {
            const connection = await pool.getConnection();
            const record = await recordsDao.insertRecord(connection, recordData, images_url);
            connection.release();
            return {recorded: true};
        } catch (error) {
            return {error: true}
        }
    },
}

export default recordsProvider;