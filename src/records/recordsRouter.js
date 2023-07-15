import express from 'express';
import recordsController from './recordsController';
import multer from 'multer';

const recordsRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'S3 bucket url'); //파일 올리면 저장할 폴더 위치
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); //저장할 때 파일이름
    }
});
 
const upload = multer({ storage: storage }).array('photos');

recordsRouter.get('/:userId(\\d+)/friends', recordsController.getFriendsRecords);
recordsRouter.post('/', upload, recordsController.postRecords);


export default recordsRouter;
