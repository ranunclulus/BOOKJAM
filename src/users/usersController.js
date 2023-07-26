import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import usersProvider from "./usersProvider";
import usersService from "./usersService";
import bcrypt from "bcrypt";
import logger from "../../config/logger";

const usersController = {
  getRecordsByUserId: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
      }
      const isUser = await usersProvider.checkUser(userId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }
      const records = await usersProvider.getRecordsByUserId(userId);
      if (records.error) return res.status(500).json(response(baseResponse.SERVER_ERROR));
      return res.status(200).json(response(baseResponse.SUCCESS, records));
    } catch (error) {
      console.error(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  patchUsername: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
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
      console.error(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  patchPassword: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
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
      console.error(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  patchProfile: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
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
      const userId = Number(req.params.userId);
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
      console.error(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  getMyPage: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
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
      console.error(error);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },

  postFollowing: async (req, res) => {
    try {
      // TODO: jwt 추가되면 수정 할 것
      const {
        body: { targetUserId },
        user: { userId },
      } = req;

      const isUser = await usersProvider.checkUser(targetUserId);
      if (!isUser) {
        return res.status(404).json(response(baseResponse.USER_NOT_FOUND));
      }

      const alreadyFollowed = await usersService.checkFollowExists(userId, targetUserId);
      if (alreadyFollowed) {
        return res.status(400).json(response(baseResponse.ALREADY_FOLLOWED));
      }

      const result = await usersProvider.addFollower(userId, targetUserId);
      logger.info(`Follow Result: ${result}`);

      return res.status(201).json(response(baseResponse.SUCCESS, { following: true }));
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json(response(baseResponse.SERVER_ERROR));
    }
  },
};

export default usersController;
