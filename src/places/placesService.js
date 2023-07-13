import pool from "../../config/database";
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
};

export default placesService;
