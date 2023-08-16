const activitiesDao = {
    selectActivityByActivityId: async (connection, activityId) => {
        const sql = `
            SELECT activity_id, created_at, title, info, capacity, headcount, total_rating, review_count, image_url, 
            (SELECT COUNT(*) FROM activity_likes WHERE activities.activity_id = activity_likes.activity_id) AS like_num 
            FROM activities
            WHERE activities.activity_id = ?
            `;
        const [queryActivity] = await connection.query(sql, activityId);
        return queryActivity;
    },
    checkUserLikedActivity: async (connection, activityId, userId) => {
        const sql = `
            SELECT id
            FROM activity_likes
            WHERE activity_likes.activity_id = '${activityId}' AND activity_likes.liker = '${userId}'
            `;
        const [queryActivity] = await connection.query(sql);

        return queryActivity;
    }
}

export default activitiesDao;