import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const storage = new aws.S3({
  credentials: {
    accessKeyId: privateInfo.AWS_ID,
    secretAccessKey: privateInfo.AWS_SECRET,
  },
});

const multerS3Uploader = multerS3({
  s3,
  bucket: "bookjam-bucket",
  key: (req, file, cb) => cb(null, file.originalname),
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
