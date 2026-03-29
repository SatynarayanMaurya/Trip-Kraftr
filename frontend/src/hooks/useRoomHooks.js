
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { roomEndpoints } from '../services/Apis/roomApis';
import { setRooms } from '../redux/slices/roomSlice';

export const useRoomHooks = () => {
    const dispatch = useDispatch();
    const allRooms = useSelector((state)=>state.room.allRooms)

    const addRoom = async (roomDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", roomEndpoints.ADD_ROOM, roomDetails)
            // dispatch(addNewHotel(response?.data?.newHotel))
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
            // dispatch(setRooms({hotelId:hotelId,rooms:response?.data?.allRooms}))
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
        updateRoomById

    };
};