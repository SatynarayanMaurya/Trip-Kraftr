
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { hotelEndpoinsts } from '../services/Apis/hotelApis'
import { addNewHotel, deleteHotelReducer, setHotelDetails, setHotelsByPage, setHotelsBySubRegionKey, updateHotel } from '../redux/slices/hotelSlice';
import { deleteRoomRateForHotel } from '../redux/slices/roomRateSlice';
import { deleteRoomForHotel } from '../redux/slices/roomSlice';

export const useHotelHooks = () => {
  const dispatch = useDispatch();
  const hotelsPages = useSelector((state) => state.hotel.hotelsPages)
  const hotelDetails = useSelector((state) => state.hotel.hotelDetails)
  const hotelsBysubRegionKey = useSelector((state)=>state.hotel.hotelsBysubRegionKey)

  const addHotel = async (hotelDetails) => {  // For Normal Org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", hotelEndpoinsts.ADD_HOTEL, hotelDetails, { "Content-Type": "multipart/form-data" })
      dispatch(addNewHotel(response?.data?.newHotel))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  // For getting Hotels with paginated
  const getHotels = async (page = 1, limit = 5) => {
    try {
      const cachedPage = hotelsPages?.[page]

      if (cachedPage) return cachedPage   // 🚀 return cached data

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${hotelEndpoinsts.GET_HOTEL}?page=${page}&limit=${limit}`
      )
      dispatch(
        setHotelsByPage({
          page,
          hotels: response?.data?.allHotels,
          pagination: response?.data?.pagination,
          stats: response?.data?.stats
        })
      )

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  // For getting Hotels by Id
  const getHotelById = async (hotelId) => {
    try {
      const cachedPage = hotelDetails?.[hotelId]

      if (cachedPage) return cachedPage
      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${hotelEndpoinsts.GET_HOTEL_BY_ID}/${hotelId}`
      )

      dispatch(setHotelDetails({ hotelId: response?.data?.foundHotel?._id, hotel: response?.data?.foundHotel }))

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }


  const getHotelsBySubRegionIds = async (subRegionIds) => {  
    try {
      const subRegionKey = subRegionIds?.join(",")
      const cachedPage = hotelsBysubRegionKey?.[subRegionKey]
      if (cachedPage) return cachedPage

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${hotelEndpoinsts.GET_HOTEL_BY_SUB_REGION_ID}?subRegionIds=${subRegionIds.join(",")}`
      );

      if(response?.data?.success){
        dispatch(setHotelsBySubRegionKey({key:subRegionKey,data:response?.data?.allHotels}))
      }

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  // For update Hotels by Id
  const updateHotelById = async (hotelId, hotelDetails) => {
    try {

      dispatch(setLoading(true))

      const response = await apiConnector(
        "PUT",
        `${hotelEndpoinsts.UPDATE_HOTEL_BY_ID}/${hotelId}`, hotelDetails, { "Content-Type": "multipart/form-data" }
      )

      if(response?.data?.success){
        dispatch(updateHotel(response?.data?.updatedHotel))
        dispatch(setHotelDetails({hotelId: hotelId, hotel: response?.data?.updatedHotel }))
      }
      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  // For update Hotels by Id
  const deleteHotelById = async (hotelId, regionId) => {
    try {

      dispatch(setLoading(true))

      const response = await apiConnector(
        "DELETE",
        `${hotelEndpoinsts.DELETE_HOTEL}`, {hotelId,regionId}, 
      )

      dispatch(deleteHotelReducer(response?.data?.deletedHotel))
      dispatch(deleteRoomRateForHotel({hotelId:hotelId}))
      dispatch(deleteRoomForHotel({hotelId:hotelId}))
      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }






  return {
    addHotel,
    getHotels,
    getHotelById,
    updateHotelById,
    deleteHotelById,
    getHotelsBySubRegionIds

  };
};