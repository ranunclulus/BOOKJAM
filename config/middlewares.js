import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "files/excels"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const s3 = new aws.S3({
  credentials: {
    accessKeyId: privateInfo.AWS_ID,
    secretAccessKey: privateInfo.AWS_SECRET,
  },
});

const multerS3Uploader = multerS3({
  s3,
  bucket: "rentalbox",
  key: (req, file, cb) => cb(null, file.originalname),
  acl: "public-read",
});
