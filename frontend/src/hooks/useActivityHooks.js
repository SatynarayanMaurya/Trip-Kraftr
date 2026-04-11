
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { activityEndpoints } from '../services/Apis/activityApis';
import { addNewActivity, setActivitiesByPage } from '../redux/slices/activitySlice';

export const useActivityHooks = () => {
    const dispatch = useDispatch();
    const activitiesPages = useSelector((state)=>state.activity.activitiesPages)
    const individualPlaces = useSelector((state)=>state.place.individualPlaces)

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




    return {
        addActivity,
        getActivities
    };
};