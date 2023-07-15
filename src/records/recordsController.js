import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import recordsService from "./recordsService";
import recordsProvider from "./recordsProvider";

const recordsController = {
    postRecords: async (req, res) => {
        try{
            let {userId, place, isbn, date, emotions, activity, contents, isNotPublic, comment_not_allowed} = req.body;
            const photos = req.files;
            const images_url = [];
            for(let i = 0; i < photos.length; i++){
                images_url.push(photos[i].path);    
            }
            userId = Number(userId); 
            place = Number(place);
            emotions = Number(emotions);
            activity = Number(activity);
            isNotPublic = Number(isNotPublic);
            comment_not_allowed = Number(comment_not_allowed);
            const chkUser = await recordsService.checkUser(userId);
            if (!chkUser) {
                return res.status(404).json(response(baseResponse.USER_NOT_FOUND))
            }
            const recordData = [userId, place, isbn, date, activity, emotions, contents, isNotPublic, comment_not_allowed];
            const records = await recordsProvider.postRecord(recordData, images_url);
            if (records.error)
                return res.status(500).json(response(baseResponse.SERVER_ERROR));
            return res.status(200).json(response(baseResponse.SUCCESS));
        } catch (error){
            console.error(error);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    },

    getFriendsRecords: async (req, res) => {
        try {
            const userId = Number(req.params.userId);
            if (!userId) {
                return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
            }
            const chkUser = await recordsService.checkUser(userId);
            if (!chkUser) {
                return res.status(404).json(response(baseResponse.USER_NOT_FOUND))
            }
            const friendId = req.query.friendId;
            if (friendId){
                const chkUser = await recordsService.checkUser(friendId);
                if (!chkUser) {
                    return res.status(404).json(response(baseResponse.USER_NOT_FOUND))
                }
                else{
                    const chkFollow = await recordsService.checkFollow(userId, friendId);
                    if (!chkFollow) {
                        return res.status(400).json(response(baseResponse.NOT_FRIEND))
                    }
                    else{
                        const records = await recordsService.getRecordsByUserId(userId, friendId)
                        if (records.error)
                            return res.status(500).json(response(baseResponse.SERVER_ERROR))
                        return res.status(200).json(response(baseResponse.SUCCESS, records));
                    }
                }
            }
            else{
                const records = await recordsService.getRecordsAll(userId)
                if (records.error)
                    return res.status(500).json(response(baseResponse.SERVER_ERROR))
                return res.status(200).json(response(baseResponse.SUCCESS, records));
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    },
}

export default recordsController;