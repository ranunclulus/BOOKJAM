const recordsDao = {
    selectRecordsByFriendId: async (connection, userId, friendId) => {
        const sql = `SELECT cr.record_id, cr.author, cr.created_at, cr.status, cr.date, cr.place_id, places.name, places.category, cr.isbn, cr.activities, cr.emotions, cr.contents, cr.comment_not_allowed, cr.comment_count, cr.like_count, cr.images_url, COUNT(likes.record_id) AS liked
        FROM (SELECT *, (SELECT GROUP_CONCAT(image_url separator '|') FROM record_images WHERE records.record_id = record_images.record_id) as images_url FROM records WHERE author = ${friendId}) AS cr 
        JOIN (SELECT place_id, category, name FROM places) AS places
        LEFT JOIN (SELECT record_id FROM record_likes WHERE liker = ${userId}) AS likes
        ON cr.place_id = places.place_id AND cr.record_id = likes.record_id
        WHERE cr.isNotPublic = 0 
        GROUP BY cr.record_id
        ORDER BY cr.created_at DESC`;
        try {
            const [records] = await connection.query(sql);
            return records;
        } catch (error) {
            console.log(error);
            return {error: true};
        }
    },

    insertRecord: async (connection, recordData, images_url) => {
        const sql_record = `INSERT INTO records (author,  place_id, isbn, date, activities, emotions, contents, isNotPublic, comment_not_allowed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const sql_record_image = `INSERT INTO record_images (record_id, image_url) VALUES (?, ?)`;
        try {
            await connection.beginTransaction();
            const [record_results] = await connection.query(sql_record, recordData);
            console.log(images_url);
            for (let url of images_url) {
                await connection.query(sql_record_image, [record_results.insertId, url]);
            }
            await connection.commit();
            return record_results;
        } catch (error) {
            await connection.rollback();
            console.error(error);
            return {error: true};
        }
        
    },

    selectRecordsAll: async (connection, userId) => {
        const sql = `SELECT cr.record_id, friends.user_id, cr.created_at, cr.status, cr.date, cr.place_id, places.name, places.category, cr.isbn, cr.activities, cr.emotions, cr.contents, cr.comment_not_allowed, cr.comment_count, cr.like_count, cr.images_url, COUNT(likes.record_id) AS liked
        FROM (SELECT *, (SELECT GROUP_CONCAT(image_url separator '|') FROM record_images WHERE records.record_id = record_images.record_id) as images_url FROM records) AS cr 
        JOIN (SELECT place_id, category, name FROM places) AS places 
        JOIN (SELECT followee AS user_id FROM follow WHERE follower = ${userId} UNION SELECT user_id FROM users WHERE user_id = ${userId}) AS friends
        LEFT JOIN (SELECT record_id FROM record_likes WHERE liker = ${userId}) AS likes
        ON cr.place_id = places.place_id AND cr.record_id = likes.record_id AND cr.author = friends.user_id
        WHERE cr.isNotPublic = 0
        GROUP BY cr.record_id
        ORDER BY cr.created_at DESC`;
        try {
            const [records] = await connection.query(sql);
            return records;
        } catch (error) {
            console.log(error);
            return {error: true};
        }
    },

    checkFollow: async (connection, userId, friendId) => {
        const sql = `SELECT count(*) as c FROM follow WHERE followee = ${friendId} and follower = ${userId}`;
        try {
            const [[records]] = await connection.query(sql);
            return records.c;
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

export default recordsDao;