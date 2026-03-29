
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { roomRateEndpoints } from '../services/Apis/roomRateApis';

export const useRoomRateHooks = () => {
    const dispatch = useDispatch();

    const addRoomRate = async (roomRateDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", roomRateEndpoints.ADD_ROOM_RATE, roomRateDetails)
            // dispatch(addNewHotel(response?.data?.newHotel))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getRoomRates = async (hotelId) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("GET", `${roomRateEndpoints.GET_ROOM_RATES}/${hotelId}`, )
            // dispatch(addNewHotel(response?.data?.newHotel))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const updateRoomRate = async (hotelId,roomRateDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("PUT", `${roomRateEndpoints.UPDATE_ROOM_RATE}/${hotelId}`, roomRateDetails)
            // dispatch(addNewHotel(response?.data?.newHotel))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }


 



    return {
        addRoomRate,
        getRoomRates,
        updateRoomRate

    };
};