
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { hotelEndpoinsts } from '../services/Apis/hotelApis'
import { addNewHotel, setHotelsByPage } from '../redux/slices/hotelSlice';

export const useHotelHooks = () => {
    const dispatch = useDispatch();
    const hotelsPages= useSelector((state)=>state.hotel.hotelsPages)

    const addHotel = async (hotelDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", hotelEndpoinsts.ADD_HOTEL, hotelDetails,{ "Content-Type": "multipart/form-data" })
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

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${hotelEndpoinsts.GET_HOTEL_BY_ID}/${hotelId}`
      )

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
        getHotelById

    };
};