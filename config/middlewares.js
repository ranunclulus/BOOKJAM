import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "./s3";

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

export default middlewares;
