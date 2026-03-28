
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


 



    return {
        addRoomRate,

    };
};