
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const activityEndpoints  = {
    ADD_ACTIVITY : BASE_URL + '/add-activity',
    GET_ACTIVITIES : BASE_URL + '/get-activities',
    // GET_PLACE_BY_ID : BASE_URL + '/get-place-by-id',
    SEARCH_ACTIVITY : BASE_URL + '/search-activities',
    // DELETE_PLACE : BASE_URL + '/delete-place',
    // UPDATE_PLACE_BY_ID : BASE_URL + '/update-place-by-id',
}

