
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { roomRateEndpoints } from '../services/Apis/roomRateApis';
import { addNewRoomRate, deleteSingleRoomRate, setRoomRates, setRoomRatesForHotelId, updateRoomRateReducer } from '../redux/slices/roomRateSlice';

export const useRoomRateHooks = () => {
    const dispatch = useDispatch();
    const allRoomRates = useSelector((state) => state.roomRate.allRoomRates)
    const roomRatesForHotelId = useSelector(s=>s.roomRate.roomRatesForHotelId)

    const addRoomRate = async (roomRateDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", roomRateEndpoints.ADD_ROOM_RATE, roomRateDetails)
            dispatch(addNewRoomRate({ hotelId: roomRateDetails?.hotelId, newRoomRate: response?.data?.newRoomRate }))
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
            dispatch(updateRoomRateReducer({ hotelId: hotelId, roomRateDetails: response?.data?.updatedRoomRate }))
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
            const response = await apiConnector("DELETE", `${roomRateEndpoints.DELETE_ROOM_RATE}`, { hotelId, roomRateId })
            dispatch(deleteSingleRoomRate({ hotelId: hotelId, deletedRoomRate: response?.data?.deletedRoomRate }))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }



    const getRoomRateByHotelIdRoomIdDate = async (hotelId, date,fetchAgain=false) => {
        try {
            const hotelCachedRates = roomRatesForHotelId?.[hotelId] || [];
            
            // Check if date exists in cached ranges
            const matchedRate = hotelCachedRates.find((rate) => {
                const activeDate = new Date(date);
                const fromDate = new Date(rate.fromDate);
                const toDate = new Date(rate.toDate);
                
                return activeDate >= fromDate && activeDate <= toDate;
            });
            
            // Use cached data if found
            if (matchedRate && !fetchAgain) {
                return matchedRate;
            }
            
            dispatch(setLoading(true));
    
            const params = new URLSearchParams();
    
            if (hotelId) params.append("hotelId", hotelId);
            if (date) params.append("date", date);
    
            const response = await apiConnector(
                "GET",
                `${roomRateEndpoints.GET_ROOM_RATE_BY_HOTELID_ROOMID_DATE}?${params.toString()}`
            );

            if (response?.data?.success) {
                const foundRate = response?.data?.foundRate;

    
                dispatch(
                    setRoomRatesForHotelId({
                        key: hotelId,
                        data: foundRate,
                    })
                );
            }
    
            if (response?.status === 404) {
                dispatch(
                    setRoomRatesForHotelId({
                        key: hotelId,
                        data: {
                            fromDate: date,
                            toDate: date,
                            noRate: true,
                        },
                    })
                );
            }
    
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };




    return {
        addRoomRate,
        getRoomRates,
        updateRoomRate,
        deleteRoomRate,
        getRoomRateByHotelIdRoomIdDate

    };
};