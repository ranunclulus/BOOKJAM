const activityDao = {
    selectActivityByActivityId: async (connection, activityId) => {
        const sql = `SELECT* FROM activities WHERE activity_id = ? ORDER BY created_at DESC;`
        try {
            const [records] = await connection.query(sql, activityId);
            return records;
        } catch (error) {
            console.log(error);
            return {error: true};
        }
    }
}

export default activityDao;