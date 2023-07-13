
import activityProvider from "./activityProvider";
import { response } from "../../config/response";
import baseResponse from "../../config/baseResponeStatus";


const activityController = {
    /**
     * API No. 1
     * API Name : 활동 세부 정보 조회
     * [GET] /places/activities/{activityId}
     */
    getActivityByActivityId: async (req, res) => {
        try {
            const activityId = req.params.activityId;

            const activity = await activityProvider.retrieveActivityByActivityId(activityId);

            if(activity.error) {
                return res.status(400).json(response(baseResponse.ACTIVITY_ACTIVITYID_EMPTY));
            }


            return res.status(200).json(response(baseResponse.SUCCESS, activity));
        } catch (error){
            console.log(error);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));


        }
    },
    /**
     * API No. 2
     * API Name : 장소에 해당하는 활동들 전부 조회
     * [GET] /places/{placeId}/acrivities
     */
    getActivitiesByPlaceId: async (req, res) => {
        try {
            const placeId = req.params.placeId;
            
            const activities = await activityProvider.retrieveActivitiesByPlaceId(placeId);

            if(activities.error) {
                return res.status(400).json(response(baseResponse.LOCATION_EMPTY));
            } 
            return res.status(200).json(response(baseResponse.SUCCESS, activities))
        } catch (error) {
            //console.log(error);
            return res.status(500).json(response(baseResponse.SERVER_ERROR));
        }
    }
}

export default activityController;