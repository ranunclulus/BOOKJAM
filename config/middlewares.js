import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: "ap-northeast-2",
});

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
