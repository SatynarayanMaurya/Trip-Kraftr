
import { apiConnector } from '../services/apiConnector'
import { useDispatch } from 'react-redux'
import { clearUserDetails, setLoading } from '../redux/slices/userSlice'
import { authEndpoints } from '../services/Apis/authApis';

export const useAuthHooks = () => {
    
    const dispatch = useDispatch();

    const logout = async()=>{
      try {
        dispatch(setLoading(true));
        const response = await apiConnector("POST",authEndpoints.LOG_OUT )
        if(response?.data?.success){
            localStorage.clear();
            dispatch(clearUserDetails())
        }
        return response; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    }
  
    return { logout };
  };