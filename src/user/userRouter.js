import express from 'express';
import userController from './userController';
import middlewares from '../../config/middlewares';

const userRouter = express.Router();

userRouter.get('/:userId(\\d+)/records', userController.getRecordsByUserId);
userRouter.put('/:userId(\\d+)/username', userController.putUsername);
userRouter.put('/:userId(\\d+)/password', userController.putPassword);
userRouter.put('/:userId(\\d+)/profile', middlewares.s3Upload.array("images", 1), userController.putProfile);
userRouter.put('/:userId(\\d+)/disabled', userController.putDisabled);



export default userRouter;
