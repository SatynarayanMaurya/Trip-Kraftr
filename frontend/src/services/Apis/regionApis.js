
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const regionEndpoints  = {
    ADD_REGION : BASE_URL + '/add-region',
    GET_REGIONS : BASE_URL + '/get-regions',
    SEARCH_MASTER_REGIONS : BASE_URL + '/search-master-regions',
}


// Super Admin 
export const regionEndPointsSuperAdmin = {
    ADD_MASTER_REGION : BASE_URL + '/add-master-region',
    GET_MASTER_REGION : BASE_URL + '/get-master-region',
}