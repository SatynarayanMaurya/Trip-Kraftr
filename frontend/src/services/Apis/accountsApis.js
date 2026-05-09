
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const accountsEndpoints  = {
    ADD_B2B_ACCOUNT : BASE_URL + '/add-b2b-account',
    ADD_B2C_ACCOUNT : BASE_URL + '/add-b2c-account',
    GET_B2B_ACCOUNTS : BASE_URL + '/get-b2b-accounts',
    GET_B2C_ACCOUNTS : BASE_URL + '/get-b2c-accounts',
    // GET_ACTIVITIES_BY_SUBREGION_IDS : BASE_URL + '/get-activities-by-subRegion-Ids',
    GET_B2B_ACCOUNT_BY_ID : BASE_URL + '/get-b2b-account-by-id',
    GET_B2C_ACCOUNT_BY_ID : BASE_URL + '/get-b2c-account-by-id',
    SEARCH_B2B_ACCOUNTS : BASE_URL + '/search-b2b-accounts',
    SEARCH_B2C_ACCOUNTS : BASE_URL + '/search-b2c-accounts',
    // DELETE_ACTIVITY : BASE_URL + '/delete-activity',
    UPDATE_B2B_ACCOUNT_BY_ID : BASE_URL + '/update-b2b-account-by-id',
    UPDATE_B2C_ACCOUNT_BY_ID : BASE_URL + '/update-b2c-account-by-id',
    UPDATE_B2B_ACCOUNT_STATUS_BY_ID : BASE_URL + '/update-b2b-account-status-by-id',
    UPDATE_B2C_ACCOUNT_STATUS_BY_ID : BASE_URL + '/update-b2c-account-status-by-id',
}

