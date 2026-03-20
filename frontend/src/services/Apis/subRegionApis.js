
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const subRegionEndpoints  = {
    ADD_SUB_REGIONS : BASE_URL + '/add-sub-regions',
    GET_SUB_REGIONS : BASE_URL + '/get-sub-regions',
    SEARCH_REGIONS_FOR_ORG : BASE_URL + '/search-regions-for-org',
    SEARCH_SUB_REGIONS : BASE_URL + '/search-sub-regions',
    GET_SUB_REGIONS_BY_ID : BASE_URL + '/get-sub-regions-by-id',
    UPDATE_SUB_REGIONS_BY_ID : BASE_URL + '/update-sub-regions-by-id',
    DELETE_SUB_REGIONS_BY_ID : BASE_URL + '/delete-sub-regions-by-id',
}

