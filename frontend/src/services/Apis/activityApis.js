
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const activityEndpoints  = {
    ADD_ACTIVITY : BASE_URL + '/add-activity',
    GET_ACTIVITIES : BASE_URL + '/get-activities',
    GET_ACTIVITIES_BY_SUBREGION_IDS : BASE_URL + '/get-activities-by-subRegion-Ids',
    GET_ACTITY_BY_ID : BASE_URL + '/get-activity-by-id',
    SEARCH_ACTIVITY : BASE_URL + '/search-activities',
    DELETE_ACTIVITY : BASE_URL + '/delete-activity',
    UPDATE_ACTIVITY_BY_ID : BASE_URL + '/update-activity-by-id',
}

