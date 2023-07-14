const activityDao = {
    selectActivityByActivityId: async (connection, activityId) => {
        const sql = `
            SELECT activity_id, created_at, title, info, capacity, headcount, total_rating, review_count, image_url, 
            (SELECT COUNT(*) FROM activity_likes WHERE activities.activity_id = activity_likes.activity_id) AS like_num 
            FROM activities
            WHERE activities.activity_id = ?
            ORDER BY created_ar DESC;
            `;
        const [queryActivity] = await connection.query(sql, activityId);
        return queryActivity;
    },

    selectActivitiesByPlaceId: async (connection, placeId) => {
        const sql = `
        SELECT * 
        FROM activities
        WHERE place_id = ?;
        `
        
        const [queryActivities] = await connection.query(sql, placeId);
        
        return queryActivities;
    }
}

export default activityDao;