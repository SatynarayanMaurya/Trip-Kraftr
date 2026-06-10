
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const privateTripEndpoints  = {
    ADD_PRIVATE_TRIP : BASE_URL + '/add-private-trip',
    GET_PRIVATE_TRIPS : BASE_URL + '/get-private-trips',
    GET_PRIVATE_TRIP_BY_ID : BASE_URL + '/get-private-trip-by-id',
    // UPDATE_SAMPLE_PACKAGE_BY_ID : BASE_URL + '/update-sample-package-by-id',
    // SEARCH_SAMPLE_PACKAGE : BASE_URL + '/search-sample-package',
}

