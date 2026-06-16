
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const privateTripEndpoints  = {
    ADD_PRIVATE_TRIP : BASE_URL + '/add-private-trip',
    GET_PRIVATE_TRIPS : BASE_URL + '/get-private-trips',
    GET_PRIVATE_TRIP_BY_ID : BASE_URL + '/get-private-trip-by-id',
    UPDATE_PRIVATE_TRIP_HOTEL_PAYMENTS : BASE_URL + '/update-private-trip-hotel-payments',
    UPDATE_PRIVATE_TRIP_HOTEL_PAYMENTS_ROW_WISE : BASE_URL + '/update-private-trip-hotel-payments-row-wise',
    UPDATE_PRIVATE_TRIP_VEHICLE_PAYMENTS : BASE_URL + '/update-private-trip-vehicle-payments',
    UPDATE_PRIVATE_TRIP_VEHICLE_PAYMENTS_ROW_WISE : BASE_URL + '/update-private-trip-vehicle-payments-row-wise',
    UPDATE_PRIVATE_TRIP_GUEST_PAYMENTS : BASE_URL + '/update-private-trip-guest-payments',
    UPDATE_PRIVATE_TRIP_GUEST_PAYMENTS_ROW_WISE : BASE_URL + '/update-private-trip-guest-payments-row-wise',
    DELETE_PRIVATE_TRIP_HOTEL_VEHICLE_PAYMENTS_ROW_WISE : BASE_URL + '/delete-hotel-vehicle-payment-row-wise',
    DELETE_PRIVATE_TRIP_GUEST_PAYMENTS_ROW_WISE : BASE_URL + '/delete-guest-payment-row-wise',
    // SEARCH_SAMPLE_PACKAGE : BASE_URL + '/search-sample-package',
}

