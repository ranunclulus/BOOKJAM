import pool from "../../config/database";
import recordsDao from "./recordsDao";

const recordsProvider = {
    postRecord: async (recordData) => {
        try {
            const connection = await pool.getConnection();
            const record = await recordsDao.insertRecord(connection, recordData);
            connection.release();
            if (record.error)
                return {error: true}
            return {recorded: true, recordId: record.insertId};
        } catch (error) {
            return {error: true}
        }
    },

    postRecordImages: async (recordId, images_url) => {
        try {
            const connection = await pool.getConnection();
            const record = await recordsDao.insertRecordImages(connection, recordId, images_url);
            connection.release();
            if (record.error)
                return {error: true}
            return {recorded: true};
        } catch (error) {
            return {error: true}
        }
    },
}

export default recordsProvider;