
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const enquiriessEndpoints  = {
    ADD_B2B_ENQUIRY : BASE_URL + '/add-b2b-enquiry',
    ADD_B2C_ENQUIRY : BASE_URL + '/add-b2c-enquiry',
    // ADD_B2C_ACCOUNT : BASE_URL + '/add-b2c-account',
    // GET_B2B_ACCOUNTS : BASE_URL + '/get-b2b-accounts',
    // GET_B2C_ACCOUNTS : BASE_URL + '/get-b2c-accounts',
    // GET_B2B_ACCOUNT_BY_ID : BASE_URL + '/get-b2b-account-by-id',
    GET_SEARCHED_B2B_ACCOUNT_FOR_ENQUIRY : BASE_URL + '/get-searched-B2B-Accounts-For-Enquiry',
    GET_SEARCHED_B2C_ACCOUNT_FOR_ENQUIRY : BASE_URL + '/get-searched-B2C-Accounts-For-Enquiry',
    // SEARCH_B2B_ACCOUNTS : BASE_URL + '/search-b2b-accounts',
    // SEARCH_B2C_ACCOUNTS : BASE_URL + '/search-b2c-accounts',
    // UPDATE_B2B_ACCOUNT_BY_ID : BASE_URL + '/update-b2b-account-by-id',
    // UPDATE_B2C_ACCOUNT_BY_ID : BASE_URL + '/update-b2c-account-by-id',
    // UPDATE_B2B_ACCOUNT_STATUS_BY_ID : BASE_URL + '/update-b2b-account-status-by-id',
    // UPDATE_B2C_ACCOUNT_STATUS_BY_ID : BASE_URL + '/update-b2c-account-status-by-id',
}

