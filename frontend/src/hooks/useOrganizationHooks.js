
import {toast} from 'react-toastify'
import { apiConnector } from '../services/apiConnector'
import { planEndpoints } from '../services/Apis/planApis'
import { useDispatch, useSelector } from 'react-redux'
import { organizationEndPoints } from '../services/Apis/organizationApis'
import { setLoading } from '../redux/slices/userSlice'

export const useOrganizationHooks = () => {
    const dispatch = useDispatch();
  
    const addOrganization = async (org_details) => {
      try {
        dispatch(setLoading(true));
        const response = await apiConnector("POST",organizationEndPoints.ADD_ORGANIZATION,org_details,{ "Content-Type": "multipart/form-data" } )
        return response?.data; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    };

    const getAllOrganizationForSuperAdmin = async()=>{
      try {
        dispatch(setLoading(true));
        const response = await apiConnector("GET",organizationEndPoints.GET_ALL_ORGANIZATION_FOR_SUPER_ADMIN )
        return response; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    }
  
    return { addOrganization,getAllOrganizationForSuperAdmin };
  };