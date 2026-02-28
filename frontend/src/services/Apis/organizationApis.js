
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const organizationEndPoints  = {
    ADD_ORGANIZATION : BASE_URL + '/add-organization',
    GET_ALL_ORGANIZATION_FOR_SUPER_ADMIN : BASE_URL + '/get-all-organization-for-super-admin',
}