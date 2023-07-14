import pool from "../../config/database";
import recordsDao from "./recordsDao";
const recordsService = {
    getRecordsByUserId: async (userId, isMine) => {
        try{
            const connection = await pool.getConnection(async conn => conn);
            const recordsResult = await recordsDao.selectRecordsByUserId(connection, userId, isMine);
            connection.release();
            if (recordsResult.error)
                return {error: true}
            
            for (let i = 0; i < recordsResult.length; i++) {
                if(recordsResult[i].images_url)
                    recordsResult[i].images_url = recordsResult[i].images_url.split('|');
            }
            return recordsResult;
        }catch(err) {
            return {error: true}
        }
    },

    getRecordsAll: async (userId) => {
        try {
            const connection = await pool.getConnection(async conn => conn);
            const recordsResult = await recordsDao.selectRecordsAll(connection, userId);
            connection.release();
            if (recordsResult.error)
                return {error: true}
            for (let i = 0; i < recordsResult.length; i++) {
                if(recordsResult[i].images_url)
                    recordsResult[i].images_url = recordsResult[i].images_url.split('|');
            }
            return recordsResult;
        } catch (error) {
            console.error(error);
            return {error: true}
        }
    },
}

export default recordsService;