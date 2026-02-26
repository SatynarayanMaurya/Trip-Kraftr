
import {toast} from 'react-toastify'
import { apiConnector } from '../services/apiConnector'
import { planEndpoints } from '../services/Apis/planApis'
export const usePlanHooks = () => {

    const createPlan = async(planDetail)=>{
        try{
            // const response = await apiConnector("POST",planEndpoints.CREATE_PLAN,planDetail)
            return null
        }
        catch(error){
            toast.error(error?.response?.data?.message || error?.message || "Error in creating a plan")
            console.log("Error in creating a plan : ",error)
        }
    }
    return { 
        createPlan
     }
  }