const baseResponse = {
  // Success
  SUCCESS: { status: "SUCCESS", code: 1000, message: "성공" },

  //FAIL
  SEARCH_KEYWORD_EMPTY: { status: "FAIL", code: 2000, message: "검색 키워드를 입력해야 합니다." },
  SORT_BY_UNAVAILABLE: { status: "FAIL", code: 2001, message: "올바른 정렬 기준이 아닙니다." },
  LOCATION_EMPTY: { status: "FAIL", code: 2003, message: "위치 정보가 없습니다." },
  RECORDS_USERID_READ_FAIL: { status: "FAIL", code: 2004, message: "기록 - 유저 아이디 읽기 실패" },
  PLACE_NOT_FOUND: { status: "FAIL", code: 2005, message: "장소가 존재하지 않습니다." },

  //ERROR
  SERVER_ERROR: { status: "ERROR", code: 3000, message: "서버 에러" },
};

export default baseResponse;
