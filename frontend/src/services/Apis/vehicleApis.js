
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const vehicleEndpoinsts  = {
    ADD_VEHICLE : BASE_URL + '/add-vehicle',
    GET_VEHICLE : BASE_URL + '/get-vehicles',
    SEARCH_VEHICLE : BASE_URL + '/search-vehicles',
}

