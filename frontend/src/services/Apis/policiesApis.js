
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const policyEndpoints  = {
    ADD_POLICY : BASE_URL + '/add-policy',
    GET_POLICY : BASE_URL + '/get-policy',
    // GET_ACTITY_BY_ID : BASE_URL + '/get-activity-by-id',
    // SEARCH_ACTIVITY : BASE_URL + '/search-activities',
    DELETE_POLICY : BASE_URL + '/delete-policy',
    UPDATE_POLICY : BASE_URL + '/update-policy',
}

