
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const roomRateEndpoints  = {
    ADD_ROOM_RATE : BASE_URL + '/add-room-rate',
    GET_ROOM_RATES : BASE_URL + '/get-room-rates',
    UPDATE_ROOM_RATE : BASE_URL + '/update-room-rates',
}

