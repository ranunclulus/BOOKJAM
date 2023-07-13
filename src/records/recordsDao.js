const recordsDao = {
    selectRecordsByUserId: async (connection, userId) => {
        const sql = `SELECT record_id, created_at, comment_count, like_count, (SELECT GROUP_CONCAT(image_url separator '|') FROM record_images WHERE records.record_id = record_images.record_id) as images_url
                    FROM records WHERE author = ${userId}
                    ORDER BY created_at DESC
                    `
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
        
    }
}

export default recordsDao;