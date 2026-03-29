
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const roomEndpoints  = {
    ADD_ROOM : BASE_URL + '/add-room',
    GET_ROOMS : BASE_URL + '/get-rooms',
    UPDATE_ROOM_BY_ID : BASE_URL + '/update-room-by-id',
    DELETE_ROOM_BY_ID : BASE_URL + '/delete-room-by-id',
}

