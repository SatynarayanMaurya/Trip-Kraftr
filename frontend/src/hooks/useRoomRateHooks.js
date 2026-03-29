
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { roomRateEndpoints } from '../services/Apis/roomRateApis';
import { addNewRoomRate, deleteSingleRoomRate, setRoomRates, updateRoomRateReducer } from '../redux/slices/roomRateSlice';

export const useRoomRateHooks = () => {
    const dispatch = useDispatch();
    const allRoomRates = useSelector((state) => state.roomRate.allRoomRates)

    const addRoomRate = async (roomRateDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", roomRateEndpoints.ADD_ROOM_RATE, roomRateDetails)
            dispatch(addNewRoomRate({hotelId:roomRateDetails?.hotelId,newRoomRate:response?.data?.newRoomRate }))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getRoomRates = async (hotelId) => {  // For Normal Org_admin
        try {
            const cachedPage = allRoomRates?.[hotelId]

            if (cachedPage) return cachedPage
            dispatch(setLoading(true));
            const response = await apiConnector("GET", `${roomRateEndpoints.GET_ROOM_RATES}/${hotelId}`,)
            dispatch(setRoomRates({ hotelId: hotelId, roomRateDetails: response?.data?.allRoomRates }))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const updateRoomRate = async (hotelId, roomRateDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("PUT", `${roomRateEndpoints.UPDATE_ROOM_RATE}/${hotelId}`, roomRateDetails)
            dispatch(updateRoomRateReducer({hotelId:hotelId,roomRateDetails:response?.data?.updatedRoomRate}))
            // console.log("response : ",response?.data?.updatedRoomRate)
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const deleteRoomRate = async (hotelId, roomRateId) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("DELETE", `${roomRateEndpoints.DELETE_ROOM_RATE}`, {hotelId, roomRateId})
            dispatch(deleteSingleRoomRate({hotelId:hotelId,deletedRoomRate:response?.data?.deletedRoomRate}))
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
        updateRoomRate,
        deleteRoomRate

    };
};