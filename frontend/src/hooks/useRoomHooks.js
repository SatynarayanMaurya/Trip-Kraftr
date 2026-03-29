
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { roomEndpoints } from '../services/Apis/roomApis';
import { addSingleRoom, deleteSingleRoom, setRooms, updateSingleRoom } from '../redux/slices/roomSlice';
import { deleteRoomRateForHotel } from '../redux/slices/roomRateSlice';

export const useRoomHooks = () => {
    const dispatch = useDispatch();
    const allRooms = useSelector((state)=>state.room.allRooms)

    const addRoom = async (roomDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", roomEndpoints.ADD_ROOM, roomDetails)
            dispatch(addSingleRoom({hotelId:roomDetails?.hotelId, room:response?.data?.newRoom}))
            dispatch(deleteRoomRateForHotel({hotelId:roomDetails?.hotelId}))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getRooms = async (hotelId) => {  // For Normal Org_admin
        try {
            const cachedPage = allRooms?.[hotelId]
            if (cachedPage) return cachedPage 
            dispatch(setLoading(true));
            const response = await apiConnector("GET", `${roomEndpoints.GET_ROOMS}?hotelId=${hotelId}`)
            dispatch(setRooms({hotelId:hotelId,rooms:response?.data?.allRooms}))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const updateRoomById = async (roomDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("PUT", `${roomEndpoints.UPDATE_ROOM_BY_ID}`,roomDetails)
            dispatch(updateSingleRoom({hotelId:roomDetails?.hotelId,room:response?.data?.updatedRoom}))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const deleteRoomById = async (hotelId, roomId) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("DELETE", `${roomEndpoints.DELETE_ROOM_BY_ID}`,{hotelId,roomId})
            dispatch(deleteSingleRoom({hotelId, roomId}))
            dispatch(deleteRoomRateForHotel({hotelId:hotelId}))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }


 



    return {
        addRoom,
        getRooms,
        updateRoomById,
        deleteRoomById

    };
};