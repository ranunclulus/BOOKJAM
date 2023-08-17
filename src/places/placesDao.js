const placesDao = {
  selectPlacesByRegExp: async (regexp, sortBy, coord, last, connection) => {
    let sql = `
      select p.place_id "placeId", p.name, p.category, a.road, a.jibun
      from places p
      join place_address a on p.place_id = a.place_id
      where name regexp '${regexp}' or a.jibun regexp '${regexp}' or a.road regexp '${regexp}'
    `;

    let sortColumn;
    if (sortBy === "rating") {
      sortColumn = "total_rating";
    } else if (sortBy === "review") {
      sortColumn = "review_count";
    } else if (sortBy === "distance") {
      sortColumn = `st_distance_sphere(point(${coord.lon}, ${coord.lat}), point(lon, lat))`;
    }

    const operator = sortBy === "distance" ? ">=" : "<=";
    const order = sortBy === "distance" ? "asc" : "desc";

    if (last) {
      sql += ` and ${sortColumn} ${operator} (select ${sortColumn} from places where place_id = ${last})`;
    }
    sql += ` order by ${sortColumn} ${order}`;
    sql += " limit 10";

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  selectPlaceHoursByDay: async (placeId, day, connection) => {
    const sql = `
      select start_time "startTime", end_time "endTime"
      from place_hours
      where place_id = ${placeId} and day = ${day}
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  selectPlaceImages: async (placeId, connection) => {
    const sql = `
      select id, image_url
      from place_reviews r
      join place_review_images i on r.review_id = i.review_id
      where r.place_id = ${placeId}
      order by created_at desc
      limit 5
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  selectPlaceById: async (placeId, connection) => {
    const sql = `
      select place_id, name
      from places
      where place_id = ${placeId}
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  selectPlaceReviews: async (placeId, last, connection) => {
    let sql = `
      select review_id "reviewId", visited_at "visitedAt", contents, rating, user_id "userId", username, profile_image "profileImage"
      from place_reviews r
      join users u on r.author = u.user_id
      where r.place_id = ${placeId} and r.status = 0  
    `;
    if (last) {
      sql += `and r.created_at < 
        (select created_at
        from place_reviews
        where review_id = ${last})`;
    }
    sql += `
      limit 5
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  selectReviewImages: async (reviewId, connection) => {
    const sql = `
      select id, image_url
      from place_review_images
      where review_id = ${reviewId}
    `;

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  insertReview: async (review, connection) => {
    try {
      const { author, placeId, visitedAt, contents, rating } = review;

      const insertReviewSql = `
      insert into place_reviews(author, visited_at, place_id, contents, rating) 
      values (${author}, "${visitedAt}", ${placeId}, '${contents}', ${rating})
      `;

      await connection.beginTransaction();

      const [queryResult] = await connection.query(insertReviewSql);

      const { insertId: reviewId } = queryResult;

      await connection.commit();

      return reviewId;
    } catch (error) {
      await connection.rollback();
      console.log(error);
    }
  },
  selectPlacesByCategory: async (category, sortBy, coord, last, connection) => {
    let sql = `
      select p.place_id "placeId", p.name, p.total_rating rating, p.review_count "reviewCount", p.category, a.road, a.jibun
      from places p
      join place_address a on p.place_id = a.place_id
      where p.category = ${category}
    `;

    let sortColumn;
    if (sortBy === "rating") {
      sortColumn = "total_rating";
    } else if (sortBy === "review") {
      sortColumn = "review_count";
    } else if (sortBy === "distance") {
      sortColumn = `st_distance_sphere(point(${coord.lon}, ${coord.lat}), point(lon, lat))`;
    }

    const operator = sortBy === "distance" ? ">=" : "<=";
    const order = sortBy === "distance" ? "asc" : "desc";

    if (last) {
      sql += ` and ${sortColumn} ${operator} (select ${sortColumn} from places where category = ${category} and place_id = ${last})`;
    }
    sql += ` order by ${sortColumn} ${order}`;
    sql += " limit 10";

    const [queryResult] = await connection.query(sql);

    return queryResult;
  },
  selectActivitiesByPlaceId: async (connection, placeId) => {
    const sql = `
        SELECT * 
        FROM activities
        WHERE place_id = ?;
        `;

    const [queryActivities] = await connection.query(sql, placeId);

    return queryActivities;
  },
  checkPlace: async (connection, placeId) => {
    const sql = `SELECT count(*) as c FROM places WHERE place_id = ${placeId}`;
    try {
      const [[records]] = await connection.query(sql);
      return records.c;
    } catch (error) {
      console.log(error);
      return { error: true };
    }
  },
  selectNewsByPlaceId: async (connection, placeId) => {
    const sql = `SELECT news_id "newsId", created_at "createdAt", updated_at "updatedcAt", title, contents, place_id "placeId" FROM place_news WHERE place_id = ${placeId} ORDER BY created_at DESC LIMIT 10;`;
    const [queryResult] = await connection.query(sql);
    return queryResult;
  },
  selectBooksByPlaceId: async (connection, placeId) => {
    const sql = `SELECT id, place_id "placeId", isbn, created_at "createAt" FROM place_books WHERE place_id = ${placeId} ORDER BY created_at DESC LIMIT 5;`;
    const [queryResult] = await connection.query(sql);
    return queryResult;
  },
};

export default placesDao;
