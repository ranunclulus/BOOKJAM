import logger from "../../config/logger";

const usersDao = {
  selectRecordsByUserId: async (connection, userId, last, category) => {
    const sql = `SELECT cr.record_id, cr.author, cr.created_at, cr.status, cr.date, cr.place_id, places.name, places.category, cr.isbn, cr.activities, cr.emotions, cr.contents, cr.isNotPublic, cr.comment_not_allowed, cr.comment_count, cr.like_count, cr.images_url
        FROM (SELECT *, (SELECT GROUP_CONCAT(image_url separator '|') FROM record_images WHERE records.record_id = record_images.record_id) as images_url FROM records WHERE author = ${userId}) AS cr 
        JOIN (SELECT place_id, category, name FROM places WHERE category = ${category}) AS places
        ON cr.place_id = places.place_id`;
    const lastq = ` WHERE cr.created_at < (select created_at FROM records WHERE record_id = ${last})`;
    const order = ` ORDER BY cr.created_at DESC LIMIT 5`;
    try {
      if (last) {
        const [records] = await connection.query(sql + lastq + order);
        return records;
      } else {
        const [records] = await connection.query(sql + order);
        return records;
      }
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  checkUser: async (connection, userId) => {
    const sql = `SELECT count(*) as c FROM users WHERE user_id = ${userId} AND disabled_at IS NULL`;
    try {
      const [[records]] = await connection.query(sql);
      return records.c;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  updateUsername: async (connection, userId, username) => {
    const sql = `UPDATE users SET username = '${username}' WHERE user_id = ${userId}`;
    try {
      const [result] = await connection.query(sql);
      console.log(result);
      return result;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  updatePassword: async (connection, userId, password) => {
    const sql = `UPDATE users SET password = '${password}' WHERE user_id = ${userId}`;
    try {
      const [result] = await connection.query(sql);
      return result;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  updateProfile: async (connection, userId, profileImg) => {
    const sql = `UPDATE users SET profile_image = '${profileImg}' WHERE user_id = ${userId}`;
    try {
      const [result] = await connection.query(sql);
      return result;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  updateDisabled: async (connection, userId) => {
    const sql = `UPDATE users SET disabled_at = NOW(6) WHERE user_id = ${userId}`;
    try {
      const [result] = await connection.query(sql);
      return result;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  selectMypageUserOutline: async (connection, userId) => {
    const sql = `SELECT j1.user_id, j1.profile_image, j1.username, count(j1.record_id) as record_count, Count(j1.) as activity_count, j1.review_count
        FROM (select u.user_id, u.profile_image, u.username, COUNT(pr.review_id) as review_count FROM (SELECT user_id, profile_image, username FROM users WHERE user_id = ${userId}) as u
        LEFT JOIN (SELECT author, review_id FROM activity_reviews WHERE author = ${userId} UNION SELECT author, review_id FROM place_reviews WHERE author = ${userId}) as pr
        ON u.user_id = pr.author
        LEFT JOIN (SELECT author, record_id FROM records WHERE author = ${userId}) as re
        ON j1.user_id = re.author
        GROUP BY u.user_id) AS j1`
    try {
      const [result] = await connection.query(sql);
      return result;
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  selectMyActivities: async (connection, userId, last) => {
    const sql = `SELECT ar.activity_id, a.title, a.total_rating, a.review_count, a.image_url FROM activity_reservations as ar
        JOIN activities as a 
        ON ar.activity_id = a.activity_id
        WHERE ar.user_id = ${userId}`;
    const lastq = ` AND ar.created_at < (select created_at from activitity_reservations where activity_id = ${last})`;
    const order = ` order by a.created_at desc LIMIT 5`;
    try {
      if (last) {
        const [result] = await connection.query(sql + lastq + order);
        return result;
      } else {
        const [result] = await connection.query(sql + order);
        return result;
      }
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  selectMyReviews: async (connection, userId, last) => {
    const sql = `SELECT r.review_id, r.visited_at, p.name, p.category, ri.image_url
        FROM (select * from place_reviews WHERE author = ${userId}) as r
        JOIN places as p
        ON r.place_id = p.place_id
        LEFT JOIN (select * from place_review_images group by review_id) as ri
        ON r.review_id = ri.review_id`;
    const lastq = ` Where r.created_at < (select created_at From place_reviews where activity_id = ${last})`;
    const order = ` ORDER BY r.created_at desc limit 5`;
    try {
      if (last) {
        const [result] = await connection.query(sql + lastq + order);
        return result;
      } else {
        const [result] = await connection.query(sql + order);
        return result;
      }
    } catch (error) {
      logger.error(error.message);
      return { error: true };
    }
  },

  insertFollow: async (userId, targetUserId, connection) => {
    const sql = `
      insert into follow(follower, followee) 
      values (${userId}, ${targetUserId})
    `;

    try {
      await connection.beginTransaction();
      const [queryResult] = await connection.query(sql);

      await connection.commit();
      return queryResult;
    } catch (error) {
      logger.error(error.message);
      await connection.rollback();
    }
  },

  selectUserFollow: async (userId, targetUserId, connection) => {
    const sql = `
      select id
      from follow
      where follower = ${userId} and followee = ${targetUserId}
      limit 1
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },

  deleteUserFollow: async (userId, targetUserId, connection) => {
    const sql = `
      delete from follow
      where follower = ${userId} and followee = ${targetUserId}
    `;

    try {
      await connection.beginTransaction();

      const [queryResult] = await connection.query(sql);

      await connection.commit();
      return queryResult;
    } catch (error) {
      logger.error(error.message);
      await connection.rollback();
    }
  },

  checkOwner: async (userId, recordId, connection) => {
    const sql = `SELECT count(*) as c FROM records WHERE author = ${userId} and record_id = ${recordId}`;
    try {
      const [[records]] = await connection.query(sql);
      return records.c;
    } catch (error) {
      console.log(error);
      return { error: true };
    }
  },

  getRecord: async (recordId, connection) => {
    const sql = `SELECT * FROM records WHERE record_id = ${recordId}`;
    const images_sql = `SELECT id, image_url FROM record_images WHERE record_id = ${recordId}`;
    try {
      const [records] = await connection.query(sql);
      const [images] = await connection.query(images_sql);
      return { records: records, images: images };
    } catch (error) {
      return { error: true };
    }
  },

  findUsersByKeyword: async (regexp, userId, last, connection) => {
    console.log(last);
    const sql = `
      select user_id userId, profile_image profileImage, username, email
      from users
      where
        disabled_at is null
        and user_id != ${userId} 
        and (
          username regexp '${regexp}' 
          or substring_index(email, '@', 1) regexp '${regexp}'
          or name regexp '${regexp}'
        )
        ${last ? `and user_id < ${last}` : ""}
      order by user_id desc
      limit 10
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },

  checkFollow: async (follower, followee, connection) => {
    const sql = `
      select id
      from follow
      where follower = ${follower} and followee = ${followee}
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
};

export default usersDao;
