
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { roomEndpoints } from '../services/Apis/roomApis';

export const useRoomHooks = () => {
    const dispatch = useDispatch();

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
            dispatch(setLoading(true));
            console.log("Hotel Id : ",hotelId)
            const response = await apiConnector("GET", `${roomEndpoints.GET_ROOMS}?hotelId=${hotelId}`)
            // dispatch(addNewHotel(response?.data?.newHotel))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

 



    return {
        addRoom,
        getRooms

    };
};