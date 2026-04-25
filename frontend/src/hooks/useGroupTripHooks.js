
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { groupTripEndpoints } from '../services/Apis/groupTripApis';
import { addNewGroupTrip, setGroupTripById, setGroupTripByPage, setGroupTripSummaryById, updateGroupTrip } from '../redux/slices/groupTripSlice';

export const useGroupTripHooks = () => {
  const dispatch = useDispatch();
  const groupTripsPages = useSelector((state) => state.groupTrip.groupTripsPages)
  const groupTripById = useSelector(s => s.groupTrip.groupTripById)

  const addGroupTrip = async (groupTripDetails) => {  // For Normal Org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", groupTripEndpoints.ADD_GROUP_TRIP, groupTripDetails)
      dispatch(addNewGroupTrip(response?.data?.newGroupTrip))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  // For getting Hotels with paginated
  const getGroupTrips = async (page = 1, limit = 5) => {
    try {
      const cachedPage = groupTripsPages?.[page]

      if (cachedPage) return cachedPage   // 🚀 return cached data

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${groupTripEndpoints.GET_GROUP_TRIPS}?page=${page}&limit=${limit}`
      )
      dispatch(
        setGroupTripByPage({
          page,
          groupTrips: response?.data?.allGroupTrips,
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

  // For getting Hotels with paginated
  const getGroupTripById = async (groupTripId) => {
    try {
      const cachedPage = groupTripById?.[groupTripId]

      if (cachedPage) return cachedPage   // 🚀 return cached data

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${groupTripEndpoints.GET_GROUP_TRIP_BY_ID}/${groupTripId}`
      )
      if (response?.data?.success) {
        dispatch(
          setGroupTripById({
            id: groupTripId,
            data: response?.data?.findGroupTrip
          })
        )
        dispatch(
          setGroupTripSummaryById({
            id: groupTripId,
            data: response?.data?.findGroupTripSummary
          })
        )
      }

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  // For getting Hotels with paginated
  const updateGroupTripById = async (groupTripDetails) => {
    try {

      dispatch(setLoading(true))

      const response = await apiConnector(
        "PUT",
        `${groupTripEndpoints.UPDATE_GROUP_TRIP_BY_ID}/${groupTripDetails?._id}`, groupTripDetails
      )
      if (response?.data?.success) {
        dispatch(
          updateGroupTrip(response?.data?.updatedGroupTrip)
        )
        dispatch(
          setGroupTripSummaryById({
            id: groupTripDetails?._id,
            data: response?.data?.updateGroupTripSummary
          })
        )
      }

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }



  return {
    addGroupTrip,
    getGroupTrips,
    getGroupTripById,
    updateGroupTripById
  };
};