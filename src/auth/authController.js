import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import authProvider from "./authProvider";
import bcrypt from "bcrypt";
import authService from "./authService";

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
  }
};

export default authController;
