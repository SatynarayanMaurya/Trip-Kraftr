
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { activityEndpoints } from '../services/Apis/activityApis';
import { addNewActivity, deleteActivity, setActivitiesByPage, setActivitiesBySubRegionKey, setIndividualActivity, updateActivity } from '../redux/slices/activitySlice';

export const useActivityHooks = () => {
    const dispatch = useDispatch();
    const activitiesPages = useSelector((state) => state.activity.activitiesPages)
    const individualActivity = useSelector((state) => state.activity.individualActivity)
    const activitiesBySubRegionKey = useSelector((state)=>state.activity.activitiesBySubRegionKey)

    const addActivity = async (activityDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", activityEndpoints.ADD_ACTIVITY, activityDetails, { "Content-Type": "multipart/form-data" })
            dispatch(addNewActivity(response?.data?.newActivity))
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    // For getting place with paginated
    const getActivities = async (page = 1, limit = 5) => {
        try {
            const cachedPage = activitiesPages?.[page]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${activityEndpoints.GET_ACTIVITIES}?page=${page}&limit=${limit}`
            )
            dispatch(
                setActivitiesByPage({
                    page,
                    activities: response?.data?.allActivities,
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


    // For getting sub region with paginated
    const getActivityById = async (activityId) => {
        try {

            const cachedPage = individualActivity?.[activityId]

            if (cachedPage) return cachedPage

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${activityEndpoints.GET_ACTITY_BY_ID}/${activityId}`
            )

            dispatch(setIndividualActivity(response?.data?.findActivity))

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

        
  const getActivitiesBySubRegionIds = async (subRegionIds) => {  
    try {
      const subRegionKey = subRegionIds?.join(",")
      const cachedPage = activitiesBySubRegionKey?.[subRegionKey]
      if (cachedPage) return cachedPage

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${activityEndpoints.GET_ACTIVITIES_BY_SUBREGION_IDS}?subRegionIds=${subRegionKey}`
      );

      if(response?.data?.success){
        dispatch(setActivitiesBySubRegionKey({key:subRegionKey,data:response?.data?.allActivities}))
      }

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

    // For getting sub region with paginated
    const updateActivityById = async (activityDetails) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${activityEndpoints.UPDATE_ACTIVITY_BY_ID}/${activityDetails?._id}`, activityDetails, { "Content-Type": "multipart/form-data" }
            )

            dispatch(updateActivity(response?.data?.updatedActivity))
            dispatch(setIndividualActivity(response?.data?.updatedActivity))
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    // For Delete Activity by Id
    const deleteActivityById = async (activityId) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "DELETE",
                `${activityEndpoints.DELETE_ACTIVITY}/${activityId}`,
            )

            dispatch(deleteActivity(response?.data?.deletedActivity?._id))
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }




    return {
        addActivity,
        getActivities,
        deleteActivityById,
        getActivityById,
        updateActivityById,
        getActivitiesBySubRegionIds
    };
};