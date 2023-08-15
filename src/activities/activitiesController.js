import activitiesProvider from "./activitiesProvider";
import { response } from "../../config/response";
import baseResponse from "../../config/baseResponeStatus";
import activitiesService from "./activitiesService";
import logger from "../../config/logger";

const activitiesController = {
  getActivityByActivityId: async (req, res) => {
    try {
      const activityId = req.params.activityId;

      const activity = await activitiesProvider.retrieveActivityByActivityId(activityId);

      if (activity.error) {
        return res.status(400).json(response(baseResponse.ACTIVITY_ACTIVITYID_EMPTY));
      }
      return res.status(200).json(response(baseResponse.SUCCESS, { activity: activity }));
    } catch (error) {
      console.log(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  postLike: async (req, res) => {
    try {
      const {
        params: { activityId },
        user: { userId },
      } = req;

      const activityExists = await activitiesProvider.retrieveActivityByActivityId(activityId);
      if (activityExists.error) {
        return res.status(404).json(response(baseResponse.ACTIVITY_NOT_FOUND));
      }

      const likeResult = await activitiesService.postLike(activityId, userId);

      if (likeResult.error) {
        return res.status(500).json(response(baseResponse.SERVER_ERROR));
      }

      return res.status(201).json(response(baseResponse.SUCCESS, { liked: true }));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  deleteLike: async (req, res) => {
    try {
      const {
        params: { activityId },
        user: { userId },
      } = req;

      const deleteResult = await activitiesService.deleteLike(activityId, userId);

      if (deleteResult.error) {
        if (deleteResult.message === "ActivityNotFound") {
          return res.status(404).json(response(baseResponse.ACTIVITY_NOT_FOUND));
        }

        if (deleteResult.message === "ActivityNotLiked") {
          return res.status(400).json(response(baseResponse.ACTIVITY_NOT_LIKED));
        }
      }

      return res.status(202).json(response(baseResponse.SUCCESS, { liked: false }));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
};

export default activitiesController;
