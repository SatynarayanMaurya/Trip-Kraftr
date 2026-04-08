
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { placeEndpoints } from '../services/Apis/placeApis'
import { addNewPlace, deletePlace, setPlacesByPage } from '../redux/slices/placeSlice';

export const usePlaceHooks = () => {
    const dispatch = useDispatch();
    const placesPages = useSelector((state)=>state.place.placesPages)

    const addPlace = async (placeDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", placeEndpoints.ADD_PLACE, placeDetails, { "Content-Type": "multipart/form-data" })
              dispatch(addNewPlace(response?.data?.newPlace))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    // For getting sub region with paginated
    const getPlaces = async (page = 1, limit = 5) => {
        try {
              const cachedPage = placesPages?.[page]

              if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${placeEndpoints.GET_PLACE}?page=${page}&limit=${limit}`
            )
              dispatch(
                setPlacesByPage({
                  page,
                  places: response?.data?.allPlaces,
                  pagination: response?.data?.pagination,
                })
              )

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }


      // For Delete place by Id
  const deletePlaceById = async (placeId) => {  
    try {

      dispatch(setLoading(true))
      
      const response = await apiConnector(
        "DELETE",
        `${placeEndpoints.DELETE_PLACE}/${placeId}`,
      )
      
      dispatch(deletePlace(response?.data?.deletedPlace?._id))
      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }






    return {
        addPlace,
        getPlaces,
        deletePlaceById
    };
};