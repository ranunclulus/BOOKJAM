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

    retrieveCommentsByRecordId: async (recordId) => {
        try {
            const connection = await pool.getConnection(async conn => conn);
            const commentResult = await recordsDao.selectCommentsByRecordId(connection, recordId);

            const recordCnt = await recordsDao.checkRecord(connection, recordId);
            console.log(recordCnt);
            if (recordCnt == 0) {
                return {error: true, cause:"record"};
            }

            if(Object.keys(commentResult).length == 0) {
                return {error: true, cause:"comment"};
            }
            connection.release();
            return {
                error:false,
                result:commentResult
            };
        } catch (err) {
            return { error:true };
        }
    }
}

export default recordsProvider;