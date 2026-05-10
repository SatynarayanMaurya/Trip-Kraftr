
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { enquiriessEndpoints } from '../services/Apis/enquiriesApis';

export const useEnquiryHooks = () => {
    const dispatch = useDispatch();

    const addEnquiryB2B = async (details) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", enquiriessEndpoints.ADD_B2B_ENQUIRY, details)
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const addEnquiryB2C = async (details) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", enquiriessEndpoints.ADD_B2C_ENQUIRY, details)
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }



    return {
        addEnquiryB2B,
        addEnquiryB2C,
    };
};