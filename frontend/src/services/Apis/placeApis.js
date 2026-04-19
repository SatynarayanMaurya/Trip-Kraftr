
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const placeEndpoints  = {
    ADD_PLACE : BASE_URL + '/add-place',
    GET_PLACE : BASE_URL + '/get-places',
    GET_PLACE_BY_SUBREGION_IDS : BASE_URL + '/get-places-by-subRegion-ids',
    GET_PLACE_BY_ID : BASE_URL + '/get-place-by-id',
    SEAECH_PLACE : BASE_URL + '/search-places',
    DELETE_PLACE : BASE_URL + '/delete-place',
    UPDATE_PLACE_BY_ID : BASE_URL + '/update-place-by-id',
}

