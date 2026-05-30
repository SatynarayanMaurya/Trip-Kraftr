
const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api/v1"

export const roomRateEndpoints  = {
    ADD_ROOM_RATE : BASE_URL + '/add-room-rate',
    GET_ROOM_RATES : BASE_URL + '/get-room-rates',
    UPDATE_ROOM_RATE : BASE_URL + '/update-room-rates',
    DELETE_ROOM_RATE : BASE_URL + '/delete-room-rate',
    GET_ROOM_RATE_BY_HOTELID_ROOMID_DATE : BASE_URL + '/get-room-rate-by-hotelId-roomId-date',
}

