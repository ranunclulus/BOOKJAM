import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import authProvider from "./authProvider";
import crypto from "crypto"
import jwt from "jsonwebtoken";

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
    const emailRows = await authProvider.checkEmail(email);

    if(!emailRows) {
      return res.status(400).json(baseResponse.SIGNIN_EMAIL_WRONG);
    }
    const selectEmail = emailRows.email;

    // 비밀번호 체크
    // 해싱 알고리즘
    const hashedPassword = await crypto.createHash("sha512")
        .update(password).digest("hex");
    // 비밀번호 확인
    const selectUserPasswordParams = [selectEmail, hashedPassword];
    const passwordRows = await authProvider.checkPassword(selectUserPasswordParams);
    // 비밀번호 다르면 에러 메시지
    if(passwordRows.password !== hashedPassword) {
      return res.status(400).json(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 이제 유저 정보 받아오기
    const userInfoRows = await authProvider.accountCheck(email);

    // 비활성화 계정이라면
    if (userInfoRows.disabled_at !== null) {
      return res.status(400).json(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    }

    // jwt 토큰 생성
    let token = await jwt.sign({
          userId : userInfoRows.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
          subject: "userInfo",
        }
    );

    const result = {
      user_id: userInfoRows.user_id,
      email: userInfoRows.email,
      jwt: token
    };
    return res.status(200).json(response(baseResponse.SUCCESS, result));
  }
};

export default authController;
