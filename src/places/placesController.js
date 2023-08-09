import baseResponse from "../../config/baseResponeStatus";
import logger from "../../config/logger";
import { response } from "../../config/response";
import placesService from "./placesService";

const CATEGORY_KEYWORD = ["0", "1", "2"];
const SORT_BY_KEYWORD = ["rating", "review", "distance"];

const placesController = {
  searchPlaces: async (req, res) => {
    try {
      const {
        query: { keyword, sortBy = "rating", lat, lon, last },
      } = req;

      if (!keyword) {
        return res.status(400).json(response(baseResponse.SEARCH_KEYWORD_EMPTY));
      }

      if (!SORT_BY_KEYWORD.includes(sortBy)) {
        return res.status(400).json(response(baseResponse.SORT_BY_UNAVAILABLE));
      }

      if (sortBy === "distance" && !(lat && lon)) {
        return res.status(400).json(response(baseResponse.LOCATION_EMPTY));
      }

      const searchResults = await placesService.searchPlaces(keyword, sortBy, { lat, lon }, last);

      return res.status(200).json(response(baseResponse.SUCCESS, searchResults));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  getReviews: async (req, res) => {
    try {
      const {
        params: { placeId },
        query: { last },
      } = req;

      const reviews = await placesService.findReviews(placeId, last);

      if (reviews.error) {
        return res.status(404).json(response(baseResponse.PLACE_NOT_FOUND));
      }

      return res.status(200).json(response(baseResponse.SUCCESS, reviews.result));
    } catch (error) {
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  postReview: async (req, res) => {
    try {
      const {
        params: { placeId },
        body: { visitedAt, contents, rating },
        user: { userId: author },
      } = req;

      const review = { author, placeId, visitedAt, contents, rating };

      const result = await placesService.addReview(review);

      if (result.error) {
        return res.status(400).json(response(baseResponse.PLACE_NOT_FOUND));
      }

      return res.status(201).json(response(baseResponse.SUCCESS, { reviewId: result.reviewId }));
    } catch (error) {
      logger.error(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  getPlaces: async (req, res) => {
    try {
      const {
        query: { category, sortBy = "distance", lat, lon, last },
      } = req;

      if (!CATEGORY_KEYWORD.includes(category)) {
        return res.status(400).json(response(baseResponse.CATEGORY_UNAVAILABLE));
      }

      if (!SORT_BY_KEYWORD.includes(sortBy)) {
        return res.status(400).json(response(baseResponse.SORT_BY_UNAVAILABLE));
      }

      if (sortBy === "distance" && !(lat & lon)) {
        return res.status(400).json(response(baseResponse.LOCATION_EMPTY));
      }

      const places = await placesService.getPlacesByCategory(category, sortBy, { lat, lon }, last);

      return res.status(200).json(response(baseResponse.SUCCESS, places));
    } catch (error) {
      console.log(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  getActivities: async (req, res) => {
    try {
      const placeId = req.params.placeId;

      const activities = await placesService.retrieveActivitiesByPlaceId(placeId);

      if (activities.error) {
        return res.status(400).json(response(baseResponse.LOCATION_EMPTY));
      }
      return res.status(200).json(response(baseResponse.SUCCESS, activities));
    } catch (error) {
      //console.log(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  getNews: async (req, res) => {
    try {
      const placeId = req.params.placeId;
      const news = await placesService.retrieveNewsByPlaceId(placeId);

      if (news.error) {
        if (news.cause == "place") {
          return res.status(400).json(response(baseResponse.LOCATION_EMPTY));
        }
        if (news.cause == "news") {
          return res.status(400).json(response(baseResponse.NEWS_NOT_FOUND));
        }
      }
      return res.status(200).json(response(baseResponse.SUCCESS, news));
    } catch (error) {
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  getBooks: async (req, res) => {
    try {
      const placeId = req.params.placeId;
      const books = await placesService.retrieveBooksByPlaceId(placeId);

      if (books.error) {
        if (books.cause == "place") {
          return res.status(400).json(response(baseResponse.LOCATION_EMPTY));
        }
        if (books.cause == "books") {
          return res.status(400).json(response(baseResponse.BOOKS_NOT_FOUND));
        }
      }
      return res.status(200).json(response(baseResponse.SUCCESS, books));
    } catch (error) {
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
};

export default placesController;
