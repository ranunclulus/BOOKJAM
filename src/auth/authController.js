import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import authProvider from "./authProvider";
import crypto from "crypto";
import jwt from "../../config/jsonWebToken";
import bcrypt from "bcrypt";
import authDao from "./authDao";

const validateEmail = (email) => {
  const emailRegex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");

  return emailRegex.test(email);
};

const authController = {
  checkEmailTaken: async (req, res) => {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json(response(baseResponse.NOT_EMAIL_EXP));
    }

    const checkResult = await authProvider.checkEmailTaken(email);

    return res.status(200).json(response(baseResponse.SUCCESS, { isEmailTaken: checkResult }));
  },

  recommandFriends: async (req, res) => {
    const friendsResult = await authProvider.recommandFriends();
    return res.status(200).json(response(baseResponse.SUCCESS, {recommandFriends: friendsResult}));
  },

  login: async (req, res) => {
    const {email, password} = req.body;
    // 이메일 체크
    const userInfo = await authProvider.findByEmail(email);

    if(!userInfo.email) {
      return res.status(400).json(baseResponse.SIGNIN_EMAIL_WRONG);
    }

    const isValidPassword = await bcrypt.compare(password, userInfo.password);

    if (!isValidPassword) {
      return res.status(400).json(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 이제 유저 정보 받아오기
    const userInfoRows = await authProvider.accountCheck(email);

    // 비활성화 계정이라면
    if (userInfo.disabled_at !== null) {
      return res.status(400).json(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    }

    // 토큰 발급
    const accessToken = jwt.sign(userInfoRows.email, userInfoRows.username);
    const refreshToken = jwt.refresh();
    // refreshToken 저장
    const postRefresh = authProvider.saveRefresh(userInfoRows.user_id, refreshToken);
    if (postRefresh.error) {
      return res.status(200).json(baseResponse.REFRESH_TOKEN_SAVE_ERROR);
    }
    // 성공했다면
    const result = {
      user_id: userInfoRows.user_id,
      email: userInfoRows.email,
      data: {
        accessToken,
        refreshToken,
      },
    };
    return res.status(200).json(response(baseResponse.SUCCESS, result));
  }
};

export default authController;
