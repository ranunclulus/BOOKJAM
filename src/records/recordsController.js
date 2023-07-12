import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import recordsService from "./recordsService";
import recordsProvider from "./recordsProvider";

const recordsController = {
    getRecordsByUserId: async (req, res) => {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
            }
            const records = await recordsService.getRecordsByUserId(userId);
            if (records.error)
                return res.status(400).json(response(baseResponse.SERVER_ERROR));
            return res.status(200).json(response(baseResponse.SUCCESS, records));
        } catch (error){
            console.log(error);
            return res.status(400).json(response(baseResponse.SERVER_ERROR));
        }
    }
}

export default recordsController;