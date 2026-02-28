
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
// export const usePlanHooks = () => {

//     const dispatch = useDispatch()

//     const createPlan = async(planDetail)=>{
//         try{
//             dispatch(setLoading(true))
//             const response = await apiConnector("POST",planEndpoints.CREATE_PLAN,planDetail)
//             toast.success(response?.data?.message)
//             dispatch(setLoading(false))
//             return response
//         }
//         catch(error){
//             dispatch(setLoading(false))
//             toast.error(error?.response?.data?.message || error?.message || "Error in creating a plan")
//             console.log("Error in creating a plan : ",error)
//         }
//     }
//     return { 
//         createPlan
//      }
//   }