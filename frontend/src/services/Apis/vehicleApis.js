
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const vehicleEndpoinsts  = {
    ADD_VEHICLE : BASE_URL + '/add-vehicle',
    GET_VEHICLE : BASE_URL + '/get-vehicles',
    UPDATE_VEHICLE : BASE_URL + '/update-vehicle',
    DELETE_VEHICLE : BASE_URL + '/delete-vehicle',
    SEARCH_VEHICLE : BASE_URL + '/search-vehicles',
}

