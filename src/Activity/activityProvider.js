import recordsDao from "./activityDao";
import pool from "../../config/database";

const activityProvider = {
    retrieveActivityByActivityId: async (activityId) => {
        try{
            const connection = await pool.getConnection(async conn => conn);
            const activityResult = await recordsDao.selectActivityByActivityId(connection, activityId);
            connection.release();
            if (activityResult.error)
                return {error: true}
            return activityResult;
        }catch(err) {
            return {error: true}
        }
    }
}

export default activityProvider;