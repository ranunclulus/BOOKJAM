const userDao = {
    selectRecordsByUserId: async (connection, userId) => {
        const sql = `SELECT cr.record_id, cr.author, cr.created_at, cr.status, cr.date, cr.place_id, places.name, places.category, cr.isbn, cr.activities, cr.emotions, cr.contents, cr.isNotPublic, cr.comment_not_allowed, cr.comment_count, cr.like_count, cr.images_url
        FROM (SELECT *, (SELECT GROUP_CONCAT(image_url separator '|') FROM record_images WHERE records.record_id = record_images.record_id) as images_url FROM records WHERE author = ${userId}) AS cr 
        JOIN (SELECT place_id, category, name FROM places) AS places
        ON cr.place_id = places.place_id
        ORDER BY cr.created_at DESC`;
        try {
            const [records] = await connection.query(sql);
            return records;
        } catch (error) {
            console.log(error);
            return {error: true};
        }
    },

    checkUser: async (connection, userId) => {
        const sql = `SELECT count(*) as c FROM users WHERE user_id = ${userId}`;
        try {
            const [[records]] = await connection.query(sql);
            return records.c;
        } catch (error) {
            console.log(error);
            return {error: true};
        }
    },
}

export default userDao;