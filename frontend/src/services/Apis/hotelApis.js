
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const hotelEndpoinsts  = {
    ADD_HOTEL : BASE_URL + '/add-hotel',
    GET_HOTEL : BASE_URL + '/get-hotels',
    GET_HOTEL_BY_SUB_REGION_ID : BASE_URL + '/get-hotel-by-subRegion-id',
    GET_HOTEL_BY_ID : BASE_URL + '/get-hotel-by-id',
    UPDATE_HOTEL_BY_ID : BASE_URL + '/update-hotel-by-id',
    UPDATE_HOTEL_STATUS_BY_ID : BASE_URL + '/update-hotel-status-by-id',
    SEARCH_HOTEL : BASE_URL + '/search-hotels',
    DELETE_HOTEL : BASE_URL + '/delete-hotel',
}

