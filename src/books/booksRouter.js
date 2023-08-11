import express from 'express';
import booksController from './booksController';

const booksRouter = express.Router();

booksRouter.get('/list', booksController.getBooksByTitle);
booksRouter.get('/info', booksController.getBooksByIsbn);

export default booksRouter;
