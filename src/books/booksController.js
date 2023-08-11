import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import logger from "../../config/logger";
import booksProvider from "./booksProvider";

const booksController = {
    getBooksByTitle: async (req, res) => {
        try{
            const title = req.query.title;
            if (!title)
                return res.status(404).json(response(baseResponse.NO_BOOK_TITLE));
            const results = await booksProvider.getBooksByTitle(title);
            if (results.error)
                return res.status(500).json(response(baseResponse.SERVER_ERROR));
            return res.status(200).json(response(baseResponse.SUCCESS, results));
        }catch(err){
            logger.error(err.message);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    },

    getBooksByIsbn: async (req, res) => {
        try{
            const isbns = req.query.isbns;
            if (!isbns)
                return res.status(404).json(response(baseResponse.NO_BOOK_ISBN));
            const results = await booksProvider.getBooksByIsbn(isbns.split(','));
            if (results.error)
                return res.status(500).json(response(baseResponse.SERVER_ERROR));
            return res.status(200).json(response(baseResponse.SUCCESS, results));
        }catch(err){
            logger.error(err.message);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    }
};

export default booksController;