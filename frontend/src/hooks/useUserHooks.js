
import { apiConnector } from '../services/apiConnector'
import { useDispatch } from 'react-redux'
import { setLoading, setUserDetails } from '../redux/slices/userSlice'
import { userEndpoints } from '../services/Apis/userApis'

export const useUserHooks = () => {
    
    const dispatch = useDispatch();

    const getUserDetails = async()=>{
      try {
        dispatch(setLoading(true));
        const response = await apiConnector("GET",userEndpoints.GET_USER_DETAILS )
        if(response?.data?.success  && response?.data?.user){
            dispatch(setUserDetails(response?.data?.user))
        }
        return response; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    }
  
    return { getUserDetails };
  };