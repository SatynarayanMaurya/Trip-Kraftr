
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const roomEndpoints  = {
    ADD_ROOM : BASE_URL + '/add-room',
    GET_ROOMS : BASE_URL + '/get-rooms',
}

