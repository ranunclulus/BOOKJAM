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
    }
}

export default recordsDao;