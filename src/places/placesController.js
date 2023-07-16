import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import placesService from "./placesService";

const CATEGORY_KEYWORD = ["0", "1", "2"];
const SORT_BY_KEYWORD = ["rating", "review", "distance"];

const placesController = {
  searchPlaces: async (req, res) => {
    try {
      const {
        query: { keyword, sortBy = "rating", lat, lon },
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

      const searchResults = await placesService.searchPlaces(keyword, sortBy, { lat, lon });

      return res.status(200).json(response(baseResponse.SUCCESS, searchResults));
    } catch (error) {
      console.log(error);
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
  getPlaces: async (req, res) => {
    try {
      const {
        query: { category, sortBy = "rating", lat, lon, last },
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
};

export default placesController;
