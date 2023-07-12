const baseResponse = {
  // Success
  SUCCESS: { status: "SUCCESS", code: 1000, message: "성공" },
  RECORDS_USERID_READ_FAIL: { status: "FAIL", code: 2003, message: "기록 - 유저 아이디 읽기 실패" },
  SERVER_ERROR: { status: "ERROR", code:3000, message: "서버 에러" },
};

export default baseResponse;
