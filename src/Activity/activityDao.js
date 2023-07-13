const activityDao = {
    selectActivityByActivityId: async (connection, activityId) => {
        const sql = `
            SELECT activity_id, created_at, title, info, capacity, headcount, total_rating, review_count, image_url, 
            (SELECT COUNT(*) FROM activity_likes WHERE activities.activity_id = activity_likes.activity_id) AS like_num 
            FROM activities
            WHERE activities.activity_id = ?;
            `
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