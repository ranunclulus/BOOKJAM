import pool from "../../config/database";
import recordsDao from "./recordsDao";
const recordsService = {
    getRecordsByUserId: async (userId) => {
        try{
            const connection = await pool.getConnection(async conn => conn);
            const recordsResult = await recordsDao.selectRecordsByUserId(connection, userId);
            connection.release();
            if (recordsResult.error)
                return {error: true}
            return recordsResult;
        }catch(err) {
            return {error: true}
        }
    }
}

export default recordsService;