import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import authProvider from "./authProvider";
import bcrypt from "bcrypt";
import authService from "./authService";
const jwt = require('jsonwebtoken');

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

  recommendFriends: async (req, res) => {
    const friendsResult = await authProvider.recommendFriends();
    return res.status(200).json(response(baseResponse.SUCCESS, {recommendFriends: friendsResult}));
  },

  signUp: async (req, res) => {
    const { kakao, email, password, username } = req.body;

    // 이미 가입된 아이디인지 검사 -> 이미 이메일 검증에서 완료함
    const hashed = await bcrypt.hash(password, 12);
    const newUser = await authService.createNewUser({
      kakao,
      email,
      password: hashed,
      username
    });
    return res.status(200).json(baseResponse.SUCCESS);
  },

  login: async (req, res) => {
    const {email, password} = req.body;
    // 이메일 체크
    const userInfo = await authProvider.findByEmail(email);

    if (!userInfo.email) {
      return res.status(400).json(response(baseResponse.SIGNIN_EMAIL_WRONG));
    }

    const isValidPassword = await bcrypt.compare(password, userInfo.password);

    if (!isValidPassword) {
      return res.status(400).json(response(baseResponse.SIGNIN_PASSWORD_WRONG));
    }

    // 이제 유저 정보 받아오기
    const userInfoRows = await authProvider.accountCheck(email);

    // 비활성화 계정이라면
    if (userInfo.disabled_at !== null) {
      return res.status(400).json(response(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    }

    const result = {
      user_id: userInfoRows.user_id,
      email: userInfoRows.email
    };

    // 토큰 발급
    let accessToken = await jwt.sign({
          userId : userInfoRows.user_id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
          issuer: "bookjam",
        }
    );

    result.accessToken = accessToken;
    let refreshToken = await jwt.sign({}, process.env.JWT_SECRET, {expiresIn: "14d"});
    result.refreshToken = refreshToken;
    // refreshToken 저장
    const postRefresh = authProvider.saveRefresh(userInfoRows.user_id, refreshToken);
    if (postRefresh.error) {
      return res.status(200).json(response(baseResponse.REFRESH_TOKEN_SAVE_ERROR));
    }

    return res.status(200).json(response(baseResponse.SUCCESS, result));
  }

};

export default authController;
