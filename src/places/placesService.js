import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import pool from "../../config/database";
import s3 from "../../config/s3";
import placesDao from "./placesDao";

const placesService = {
  searchPlaces: async (keyword, sortBy, coord) => {
    const connection = await pool.getConnection();

    let searchResult = await placesDao.selectPlaces(keyword, sortBy, coord, connection);
    console.log(searchResult);

    const curr = new Date();
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const krCurr = new Date(utc + KR_TIME_DIFF);
    const day = krCurr.getDay();

    searchResult = await Promise.all(
      searchResult.map(async (place) => {
        const [hours] = await placesDao.selectPlaceHoursByDay(place.placeId, day, connection);
        let open = null;
        if (hours) {
          const { start_time: startTime, end_time: endTime } = hours;
          const baseTime = `${krCurr.getFullYear()}-${krCurr.getMonth() + 1}-${krCurr.getDate()}`;
          const startTimeDate = new Date(`${baseTime} ${startTime}`);
          const endTimeDate = new Date(`${baseTime} ${endTime}`);
          open = startTimeDate.getTime() <= krCurr.getTime() && krCurr.getTime() <= endTimeDate.getTime();
        }

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

    connection.release();

    return {
      error: false,
      result: reviews,
    };
  },
  addReview: async (review) => {
    const connection = await pool.getConnection();

    const [placeExists] = await placesDao.selectPlaceById(review.placeId, connection);
    if (!placeExists) {
      return { error: true };
    }

    const reviewId = await placesDao.insertReview(review, connection);
    connection.release();

    return { error: false, reviewId };
  },
};

export default placesService;
