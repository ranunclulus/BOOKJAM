import pool from "../../config/database";
import placesDao from "./placesDao";

const getTime = () => {
  const curr = new Date();
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const krCurr = new Date(utc + KR_TIME_DIFF);
  return krCurr;
};

const checkOpen = (hours, krCurr) => {
  if (!hours) {
    return null;
  }

  const { startTime, endTime } = hours;
  const baseTime = `${krCurr.getFullYear()}-${krCurr.getMonth() + 1}-${krCurr.getDate()}`;
  const startTimeDate = new Date(`${baseTime} ${startTime}`);
  const endTimeDate = new Date(`${baseTime} ${endTime}`);
  const open = startTimeDate.getTime() <= krCurr.getTime() && krCurr.getTime() <= endTimeDate.getTime();

  return open;
};

const placesService = {
  searchPlaces: async (keyword, sortBy, coord) => {
    const connection = await pool.getConnection();

    let searchResult = await placesDao.selectPlacesByKeyword(keyword, sortBy, coord, connection);

    const curr = getTime();

    searchResult = await Promise.all(
      searchResult.map(async (place) => {
        const [hours] = await placesDao.selectPlaceHoursByDay(place.placeId, curr.getDay(), connection);
        const open = checkOpen(hours, curr);

        const imagesRaw = await placesDao.selectPlaceImages(place.placeId, connection);
        const images = imagesRaw.map(({ image_url }) => image_url);

        const { road, jibun, ...rest } = place;

        return {
          ...rest,
          open,
          images,
          address: {
            road,
            jibun,
          },
        };
      })
    );

    connection.release();

    return searchResult;
  },
  findReviews: async (placeId, last) => {
    const connection = await pool.getConnection();

    const [placeExists] = await placesDao.selectPlaceById(placeId, connection);

    if (!placeExists) {
      return { error: true };
    }

    let reviews = await placesDao.selectPlaceReviews(placeId, last, connection);
    reviews = await Promise.all(
      reviews.map(async (review) => {
        const images = (await placesDao.selectReviewImages(review.reviewId, connection)).map((obj) => obj.image_url);
        const { userId, username, profileImage, ...rest } = review;

        return {
          ...rest,
          images,
          author: {
            userId,
            username,
            profileImage,
          },
        };
      })
    );

    return {
      error: false,
      result: reviews,
    };
  },
  getPlacesByCategory: async (category, sortBy, coord, last) => {
    const connection = await pool.getConnection();

    let searchResult = await placesDao.selectPlacesByCategory(category, sortBy, coord, last, connection);

    const curr = getTime();

    searchResult = await Promise.all(
      searchResult.map(async (place) => {
        const [hours] = await placesDao.selectPlaceHoursByDay(place.placeId, curr.getDay(), connection);
        const open = checkOpen(hours, curr);

        const imagesRaw = await placesDao.selectPlaceImages(place.placeId, connection);
        const images = imagesRaw.map(({ image_url }) => image_url);

        const { road, jibun, ...rest } = place;

        return {
          ...rest,
          open,
          images,
          address: {
            road,
            jibun,
          },
        };
      })
    );

    connection.release();

    return searchResult;
  },
};

export default placesService;
