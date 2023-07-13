import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import recordsService from "./recordsService";
import recordsProvider from "./recordsProvider";

const recordsController = {
    getRecordsByUserId: async (req, res) => {
        try {
            const userId = Number(req.params.userId);
            if (!userId) {
                return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
            }
            const records = await recordsService.getRecordsByUserId(userId);
            if (records.error)
                return res.status(500).json(response(baseResponse.SERVER_ERROR));
            return res.status(200).json(response(baseResponse.SUCCESS, records));
        } catch (error){
            console.log(error);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    },

    postRecords: async (req, res) => {
        try{
            const userId = Number(req.params.userId);
            if (!userId) {
                return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
            }
            let {place, isbn, date, emotions, activity, contents, isNotPublic, comment_not_allowed} = req.body;
            const photos = req.files;
            const images_url = [];
            for(let i = 0; i < photos.length; i++){
                images_url.push(photos[i].path);
            }
            place = Number(place);
            emotions = Number(emotions);
            activity = Number(activity);
            isNotPublic = Number(isNotPublic);
            comment_not_allowed = Number(comment_not_allowed);
            const recordData = [userId, place, isbn, date, activity, emotions, contents, isNotPublic, comment_not_allowed];
            const records = await recordsProvider.postRecord(recordData, images_url);
            if (records.error)
                return res.status(500).json(response(baseResponse.SERVER_ERROR));
            return res.status(200).json(response(baseResponse.SUCCESS));
        } catch (error){
            console.log(error);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    }

}

export default recordsController;