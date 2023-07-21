import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "./s3";
import jwt from "jsonwebtoken";
import baseResponse from "./baseResponeStatus";


const multerS3Uploader = multerS3({
  s3,
  bucket: "bookjam-bucket",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const middlewares = {
  s3Upload: multer({
    dest: "uploads/images/",
    limits: {
      fieldSize: 5 * 1024 * 1024,
    },
    storage: multerS3Uploader,
  }),
};
const jwtMiddleware = (req,res,next) =>{
  // read the token from header or url
  const token = req.headers['x-access-token'] || req.query.token;
  // token does not exist
  if(!token) {
    return res.send(baseResponse.TOKEN_EMPTY)
  }

  // create a promise that decodes the token
  const p = new Promise(
      (resolve, reject) => {
        jwt.verify(token, secret_config.jwtsecret , (err, verifiedToken) => {
          if(err) reject(err);
          resolve(verifiedToken)
        })
      }
  );

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    return res.send(baseResponse.TOKEN_VERIFICATION_FAILURE)
  };
  // process the promise
  p.then((verifiedToken)=>{
    //비밀 번호 바뀌었을 때 검증 부분 추가 할 곳
    req.verifiedToken = verifiedToken;
    next();
  }).catch(onError);
}

export default middlewares;
