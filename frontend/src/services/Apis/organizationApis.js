
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const organizationEndPoints  = {
    ADD_ORGANIZATION : BASE_URL + '/add-organization',
    ADD_ORGANIZATION_ADMIN : BASE_URL + '/add-organization-admin',
    GET_ALL_ORGANIZATION_FOR_SUPER_ADMIN : BASE_URL + '/get-all-organization-for-super-admin',
}