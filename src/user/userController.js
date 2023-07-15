import baseResponse from "../../config/baseResponeStatus";
import { response } from "../../config/response";
import userService from "./userService";
import userProvider from "./userProvider";

const userController = {
    getRecordsByUserId: async (req, res) => {
        try {
            const userId = Number(req.params.userId);
            if (!userId) {
                return res.status(400).json(response(baseResponse.RECORDS_USERID_READ_FAIL));
            }
            const isUser = await userService.checkUser(userId)
            if (!isUser) {
                return res.status(404).json(response(baseResponse.USER_NOT_FOUND))
            }
            const records = await userService.getRecordsByUserId(userId);
            if (records.error)
                return res.status(500).json(response(baseResponse.SERVER_ERROR));
            return res.status(200).json(response(baseResponse.SUCCESS, records));
        } catch (error){
            console.error(error);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    },
}

export default userController;