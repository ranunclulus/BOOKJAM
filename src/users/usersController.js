import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import usersProvider from "./usersProvider";
import usersService from "./usersService";
import bcrypt from "bcrypt";
import logger from "../../config/logger";

const usersController = {
  getRecordsByUserId: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const last = req.query.lastId;
      const category = req.query.category;
      const records = await usersProvider.getRecordsByUserId(userId, last, category);
      if (records.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, records));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  patchUsername: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const username = req.body.username;
      const result = await usersService.patchUsername(userId, username);
      if (result.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  patchPassword: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const password = await bcrypt.hash(req.body.password, 12);
      const result = await usersService.patchPassword(userId, password);
      if (result.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  patchProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }

      const profileImg = req.file.location;
      const result = await usersService.patchProfile(userId, profileImg);

      if (result.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (error) {
      logger.error(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  patchDisabled: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const result = await usersService.patchDisabled(userId);
      if (result.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  getMyPage: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const result = await usersProvider.getMyPage(userId);
      if (result.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  postFollowing: async (req, res) => {
    try {
      const {
        body: { targetUserId },
        user: { userId },
      } = req;

      const userExists = await usersProvider.checkUser(targetUserId);
      if (!userExists) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }

      const followed = await usersProvider.checkFollowExists(userId, targetUserId);
      if (followed) {
        return res.status(400).json(response(baseResponse.ALREADY_FOLLOWED));
      }

      const result = await usersService.addFollower(userId, targetUserId);
      logger.info(`Follow Result: ${result}`);

      return res.status(201).json(response(baseResponse.SUCCESS, { following: true }));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  deleteFollowing: async (req, res) => {
    try {
      const {
        params: { targetUserId },
        user: { userId },
      } = req;

      const userExists = await usersProvider.checkUser(targetUserId);
      if (!userExists) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }

      const followed = await usersProvider.checkFollowExists(userId, targetUserId);
      if (!followed) {
        return res.status(400).json(response(baseResponse.NOT_FOLLOWED));
      }

      const result = await usersService.addFollower(userId, targetUserId);
      logger.info(`Unfollow Result: ${JSON.stringify(result)}`);

      return res.status(202).json(response(baseResponse.SUCCESS, { following: false }));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
  
  getMyReviews: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const last = req.query.lastId;
      const records = await usersProvider.getMyReviews(userId, last);
      if (records.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, records));
    }catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
      
  getRecordForUpdate: async (req, res) => {
    try {
      const userId = req.user.userId;
      const recordId = req.params.recordId;
      const checkOwner = await usersProvider.checkOwner(userId, recordId);
      if (!checkOwner) {
        return res.status(404).json(response(baseResponse.IS_NOT_RECORD_OWNER));
      }
      const result = await usersProvider.getRecord(recordId);
      if (result.error){
        return res.status(500).json(response(baseResponse.SERVER_ERROR));
      }
      return res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  getMyActivities: async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const last = req.query.lastId;
      const records = await usersProvider.getMyActivities(userId, last);
      if (records.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, records));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

};

export default usersController;
