import express from 'express';
import userController from './userController';
import multer from 'multer';

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'S3 bucket url'); //파일 올리면 저장할 폴더 위치
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); //저장할 때 파일이름
    }
});
 
const upload = multer({ storage: storage }).array('photos');

userRouter.get('/:userId(\\d+)/records', userController.getRecordsByUserId);
userRouter.put('/:userId(\\d+)/username', userController.putUsername);
userRouter.put('/:userId(\\d+)/password', userController.putPassword);
userRouter.put('/:userId(\\d+)/profile', upload, userController.putProfile);
userRouter.put('/:userId(\\d+)/disabled', userController.putDisabled);
userRouter.get('/:userId(\\d+)', userController.getMyPage);


export default userRouter;
