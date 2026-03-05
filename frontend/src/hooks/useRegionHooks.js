
import {toast} from 'react-toastify'
import { apiConnector } from '../services/apiConnector'
import { planEndpoints } from '../services/Apis/planApis'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { regionEndpoints } from '../services/Apis/regionApis'

export const useRegionHooks = () => {
    const dispatch = useDispatch();
  
    const addRegion = async (regionDetails)=>{
      try {
        dispatch(setLoading(true));
        const response = await apiConnector("POST",regionEndpoints.ADD_REGION,regionDetails)
        return response; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    }
  
    return { addRegion };
  };