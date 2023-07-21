import express from 'express';
import userController from './userController';
import middlewares from '../../config/middlewares';

const userRouter = express.Router();

userRouter.get('/:userId(\\d+)/records', userController.getRecordsByUserId);
userRouter.patch('/:userId(\\d+)/username', userController.patchUsername);
userRouter.patch('/:userId(\\d+)/password', userController.patchPassword);
userRouter.patch('/:userId(\\d+)/profile', upload, userController.patchProfile);
userRouter.patch('/:userId(\\d+)/disabled', userController.patchDisabled);
userRouter.get('/:userId(\\d+)', userController.getMyPage);


export default userRouter;
