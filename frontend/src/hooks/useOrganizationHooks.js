
import { apiConnector } from '../services/apiConnector'
import { useDispatch } from 'react-redux'
import { organizationEndPoints } from '../services/Apis/organizationApis'
import { setLoading } from '../redux/slices/userSlice'
import { setAllOrganizations } from '../redux/slices/organizationSlice'

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
        dispatch(setAllOrganizations(response?.data?.allOrganizations))
        return response; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    }
    
    const addOrganizationAdmin = async (adminDetails)=>{
      try {
        dispatch(setLoading(true));
        const response = await apiConnector("POST",organizationEndPoints.ADD_ORGANIZATION_ADMIN,adminDetails)
        return response; 
      } catch (error) {
        throw error;
      } finally {
        dispatch(setLoading(false)); 
      }
    }
  
    return { addOrganization,getAllOrganizationForSuperAdmin,addOrganizationAdmin };
  };