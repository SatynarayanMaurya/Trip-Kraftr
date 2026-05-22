
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const groupTripEndpoints  = {
    ADD_GROUP_TRIP : BASE_URL + '/add-group-trip',
    ADD_GROUP_TRIP_PARTICIPANT : BASE_URL + '/add-group-trip-participant',
    GET_GROUP_TRIP_PARTICIPANT : BASE_URL + '/get-group-trip-participants',
    GET_GROUP_TRIPS : BASE_URL + '/get-group-trips',
    SUGGESTION_GROUP_TRIPS : BASE_URL + '/suggestion-group-trips',
    // GET_ACTIVITIES_BY_SUBREGION_IDS : BASE_URL + '/get-activities-by-subRegion-Ids',
    GET_GROUP_TRIP_BY_ID : BASE_URL + '/get-group-trip-by-id',
    SEARCH_GROUP_TRIPS : BASE_URL + '/search-group-Trips',
    // DELETE_ACTIVITY : BASE_URL + '/delete-activity',
    UPDATE_GROUP_TRIP_BY_ID : BASE_URL + '/update-group-trip-by-id',
    UPDATE_GROUP_TRIP_PARTICIPANT_BY_ID : BASE_URL + '/update-group-trip-participant-by-id',
    UPDATE_GROUP_TRIP_SUMMARY_BY_ID : BASE_URL + '/update-group-trip-summary-by-id',
    UPDATE_GROUP_TRIP_STATUS_BY_ID : BASE_URL + '/update-group-trip-status-by-id',
    DELETE_GROUP_TRIP_STATUS_BY_ID : BASE_URL + '/delete-group-trip-participant-by-id',
}

