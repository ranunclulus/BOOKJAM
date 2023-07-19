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
userRouter.patch('/:userId(\\d+)/username', userController.patchUsername);
userRouter.patch('/:userId(\\d+)/password', userController.patchPassword);
userRouter.patch('/:userId(\\d+)/profile', upload, userController.patchProfile);
userRouter.patch('/:userId(\\d+)/disabled', userController.patchDisabled);



export default userRouter;
