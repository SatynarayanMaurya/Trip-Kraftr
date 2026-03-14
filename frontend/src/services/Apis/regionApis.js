
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const regionEndpoints  = {
    ADD_REGION : BASE_URL + '/add-region',
    GET_REGIONS : BASE_URL + '/get-regions',
    GET_REGION_BY_ID : BASE_URL + '/get-region-by-id',
    UPDATE_REGION_BY_ID : BASE_URL + '/update-region-by-id',
    DELETE_REGION_BY_ID : BASE_URL + '/delete-region-by-id',
    SEARCH_MASTER_REGIONS : BASE_URL + '/search-master-regions',
    FETCH_REGIONS_IMAGES : BASE_URL + '/fetch-regions-images',
    SEARCH_MASTER_COUNTRIES : BASE_URL + '/search-master-countries',
    SEARCH_MASTER_REGION_ONLY : BASE_URL + '/search-master-regions-only',
}


// Super Admin 
export const regionEndPointsSuperAdmin = {
    ADD_MASTER_REGION : BASE_URL + '/add-master-region',
    GET_MASTER_REGION : BASE_URL + '/get-master-region',
    ADD_REGION_IMAGES : BASE_URL + '/add-region-images',
}