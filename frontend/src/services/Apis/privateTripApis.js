
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const privateTripEndpoints  = {
    ADD_PRIVATE_TRIP : BASE_URL + '/add-private-trip',
    GET_PRIVATE_TRIPS : BASE_URL + '/get-private-trips',
    GET_PRIVATE_TRIP_BY_ID : BASE_URL + '/get-private-trip-by-id',
    UPDATE_PRIVATE_TRIP_HOTEL_PAYMENTS : BASE_URL + '/update-private-trip-hotel-payements',
    UPDATE_PRIVATE_TRIP_VEHICLE_PAYMENTS : BASE_URL + '/update-private-trip-vehicle-payements',
    UPDATE_PRIVATE_TRIP_GUEST_PAYMENTS : BASE_URL + '/update-private-trip-guest-payements',
    // SEARCH_SAMPLE_PACKAGE : BASE_URL + '/search-sample-package',
}

