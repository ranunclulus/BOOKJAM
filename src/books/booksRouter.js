import express from 'express';
import booksController from './booksController';

const booksRouter = express.Router();

booksRouter.get('/list', booksController.getBooksByTitle);

export default booksRouter;
