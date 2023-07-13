import express from 'express';
import recordsController from './recordsController';

const recordsRouter = express.Router();

recordsRouter.get('/:userId(\\d+)', recordsController.getRecordsByUserId);

export default recordsRouter;
