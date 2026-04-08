
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const placeEndpoints  = {
    ADD_PLACE : BASE_URL + '/add-place',
    GET_PLACE : BASE_URL + '/get-places',
    SEAECH_PLACE : BASE_URL + '/search-places',
    DELETE_PLACE : BASE_URL + '/delete-place',
}

