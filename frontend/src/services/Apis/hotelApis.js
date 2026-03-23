
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const hotelEndpoinsts  = {
    ADD_HOTEL : BASE_URL + '/add-hotel',
    GET_HOTEL : BASE_URL + '/get-hotels',
    SEARCH_HOTEL : BASE_URL + '/search-hotels',
}

