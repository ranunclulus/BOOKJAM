const baseResponse = {
  // Success
  SUCCESS: { status: "SUCCESS", code: 1000, message: "성공" },

  //FAIL
  SEARCH_KEYWORD_EMPTY: { status: "FAIL", code: 2000, message: "검색 키워드를 입력해야 합니다." },
  SORT_BY_UNAVAILABLE: { status: "FAIL", code: 2001, message: "올바른 정렬 기준이 아닙니다." },
  LOCATION_EMPTY: { status: "FAIL", code: 2003, message: "위치 정보가 없습니다." },
  RECORDS_USERID_READ_FAIL: { status: "FAIL", code: 2004, message: "기록 - 유저 아이디 읽기 실패" },
  PLACE_NOT_FOUND: { status: "FAIL", code: 2005, message: "장소가 존재하지 않습니다." },
  NOT_FRIEND: { status: "FAIL", code: 2006, message: "친구가 아닌 유저입니다." },
  USER_NOT_FOUND: { status: "FAIL", code: 2007, message: "존재하지 않는 유저입니다." },
  REVIEW_NOT_FOUND: { status: "FAIL", code: 2008, message: "리뷰가 존재하지 않습니다." },
  NEWS_NOT_FOUND: { status: "FAIL", code: 2009, message: "소식이 존재하지 않습니다." },
  BOOKS_NOT_FOUND: { status: "FAIL", code: 2010, message: "책이 존재하지 않습니다." },
  ACTIVITY_ACTIVITYID_EMPTY: { status: "FAIL", code: 2100, message: "존재하지 않는 activityId" },
  NOT_EMAIL_EXP: { status: "FAIL", code: "2009", message: "이메일 형식이 아닙니다." },
  CATEGORY_UNAVAILABLE: { status: "FAIL", code: 2010, message: "올바른 카테고리가 아닙니다." },
  RECORDID_NOT_FOUND: { status: "FAIL", code: 2011, message: "존재하지 않는 기록입니다." },
  ALREADY_FOLLOWED: { status: "FAIL", code: 2012, message: "이미 친구로 등록된 회원입니다." },
  COMMENT_NOT_FOUND: { status: "FAIL", code: 2012, message: "존재하지 않는 댓글입니다." },
  IS_NOT_COMMENT_OWNER: { status: "FAIL", code: 2013, message: "댓글을 쓴 유저가 아닙니다." },
  JWT_TOKEN_EMPTY: { status: "FAIL", code: 2013, message: "JWT 토큰이 없습니다." },
  JWT_VERIFICATION_FAILED: { status: "FAIL", code: 2014, message: "JWT 검증에 실패했습니다." },
  IS_NOT_REVIEW_OWNER: { status: "FAIL", code: 2015, message: "리뷰 작성자가 아닙니다." },
  JWT_EXPIRED: { status: "FAIL", code: 2016, message: "JWT가 만료되었습니다." },
  NOT_FOLLOWED: { status: "FAIL", code: 2017, message: "친구로 등록하지 않은 회원입니다." },




  TOKEN_EMPTY: { status: "FAIL", code: 2030, message: "토큰이 존재하지 않습니다." },
  TOKEN_VERIFICATION_FAILURE: { status: "FAIL", code: 2031, message: "토큰이 일치하지 않습니다." },
  SIGNIN_PASSWORD_WRONG: { status: "FAIL", code: 2032, message: "비밀번호가 일치하지 않습니다." },
  SIGNIN_EMAIL_WRONG: { status: "FAIL", code: 2033, message: "이메일이 일치하지 않습니다." },
  SIGNIN_INACTIVE_ACCOUNT: { status: "FAIL", code: 2034, message: "활성화된 계정이 아닙니다." },
  REFRESH_TOKEN_SAVE_ERROR: { status: "FAIL", code: 2035, message: "Refresh 토큰 저장에 실패했습니다." },

  //ERROR
  SERVER_ERROR: { status: "ERROR", code: 3000, message: "서버 에러" },
};

export default baseResponse;
