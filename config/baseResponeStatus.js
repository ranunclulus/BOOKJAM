const baseResponse = {
  // Success
  SUCCESS: { status: "SUCCESS", code: 1000, message: "성공" },
  // REQUEST ERROR
  ACTIVITY_ACTIVITYID_EMPTY: { status: "FAIL", code: 2100, message: "존재하지 않는 activityId" },
  // SERVER ERROR
  SERVER_ERROR: { status: "ERROR", code:3000, message: "서버 에러" },
};

export default baseResponse;
