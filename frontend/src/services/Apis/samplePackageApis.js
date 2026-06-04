
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const samplePackageEndpoints  = {
    ADD_SAMPLE_PACKAGE : BASE_URL + '/add-sample-package',
    GET_SAMPLE_PACKAGES : BASE_URL + '/get-sample-package',
    GET_SAMPLE_PACKAGE_BY_ID : BASE_URL + '/get-sample-package-by-id',
    UPDATE_SAMPLE_PACKAGE_BY_ID : BASE_URL + '/update-sample-package-by-id',
    SEARCH_SAMPLE_PACKAGE : BASE_URL + '/search-sample-package',
    // GET_ROOMS_TYPE_FOR_HOTELID : BASE_URL + '/get-rooms-type-for-hotelId',
    // UPDATE_ROOM_BY_ID : BASE_URL + '/update-room-by-id',
    // DELETE_ROOM_BY_ID : BASE_URL + '/delete-room-by-id',
}

