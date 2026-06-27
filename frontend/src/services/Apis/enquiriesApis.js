
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const enquiriessEndpoints  = {
    ADD_B2B_ENQUIRY : BASE_URL + '/add-b2b-enquiry',
    ADD_B2C_ENQUIRY : BASE_URL + '/add-b2c-enquiry',
    GET_B2B_ENQUIRY : BASE_URL + '/get-b2b-enquiry',
    GET_B2C_ENQUIRY : BASE_URL + '/get-b2c-enquiry',
    GET_B2B_ENQUIRY_BY_ID : BASE_URL + '/get-b2b-enquiry-by-id',
    GET_B2C_ENQUIRY_BY_ID : BASE_URL + '/get-b2c-enquiry-by-id',
    GET_ALL_GROUPTRIP_AND_PRIVATETRIP_ASSOCIATED_WITH_ENQUIRYID : BASE_URL + '/get-All-GroupTrip-And-PrivateTrip-Associated-With-EnquiryId',
    GET_SEARCHED_B2B_ACCOUNT_FOR_ENQUIRY : BASE_URL + '/get-searched-B2B-Accounts-For-Enquiry',
    GET_SEARCHED_B2C_ACCOUNT_FOR_ENQUIRY : BASE_URL + '/get-searched-B2C-Accounts-For-Enquiry',
    SEARCH_B2B_ENQUIRY : BASE_URL + '/search-b2b-enquiry',
    SEARCH_B2C_ENQUIRY : BASE_URL + '/search-b2c-enquiry',
    UPDATE_B2B_ENQUIRY_BY_ID : BASE_URL + '/update-b2b-enquiry-by-id',
    UPDATE_B2C_ENQUIRY_BY_ID : BASE_URL + '/update-b2c-enquiry-by-id',
    DELETE_B2B_ENQUIRY_BY_ID : BASE_URL + '/delete-b2b-enquiry-by-id',
    DELETE_B2C_ENQUIRY_BY_ID : BASE_URL + '/delete-b2c-enquiry-by-id',
}

