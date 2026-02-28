
import {toast} from 'react-toastify'
import { apiConnector } from '../services/apiConnector'
import { planEndpoints } from '../services/Apis/planApis'
import { useDispatch } from 'react-redux'
import { setLoading } from '../redux/slices/planSlice'

export const usePlanHooks = () => {
    const dispatch = useDispatch();
  
    const createPlan = async (planDetail) => {
      dispatch(setLoading(true));
      try {
        const response = await apiConnector(
          "POST",
          planEndpoints.CREATE_PLAN,
          planDetail
        );
  
        return response.data; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    };
  
    return { createPlan };
  };