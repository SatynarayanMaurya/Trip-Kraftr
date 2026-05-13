
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { enquiriessEndpoints } from '../services/Apis/enquiriesApis';
import { addNewB2BEnquiry, addNewB2CEnquiry, clearB2BEnquiries, clearB2CEnquiries, setB2BEnquiriesByPage, setB2CEnquiriesByPage } from '../redux/slices/enquirySlice';

export const useEnquiryHooks = () => {
    const dispatch = useDispatch();
    const b2bEnquiriesByPage = useSelector(s=>s.enquiry.b2bEnquiriesByPage)
    const b2cEnquiriesByPage = useSelector(s=>s.enquiry.b2cEnquiriesByPage)

    const addEnquiryB2B = async (details) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", enquiriessEndpoints.ADD_B2B_ENQUIRY, details)
            if(response?.data?.success){
                dispatch(addNewB2BEnquiry(response?.data?.newEnquiry))
            }
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
            if(response?.data?.success){
                dispatch(addNewB2CEnquiry(response?.data?.newEnquiry))
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }


    
    // For getting accounts with paginated
    const getb2bEnquiries = async (page = 1, limit = 5) => {
        try {
            const cachedPage = b2bEnquiriesByPage?.[page]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${enquiriessEndpoints.GET_B2B_ENQUIRY}?page=${page}&limit=${limit}`
            )
            if(response?.data?.success){
                dispatch(
                    setB2BEnquiriesByPage({
                        page,
                        data: response?.data?.allB2BEnquiries,
                        pagination: response?.data?.pagination,
                    })
                )
            }

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    // For getting accounts with paginated
    const getb2bEnquiryById = async (enquiryId) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${enquiriessEndpoints.GET_B2B_ENQUIRY_BY_ID}/${enquiryId}`
            )
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    // For getting accounts with paginated
    const getb2cEnquiries = async (page = 1, limit = 5) => {
        try {
            const cachedPage = b2cEnquiriesByPage?.[page]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${enquiriessEndpoints.GET_B2C_ENQUIRY}?page=${page}&limit=${limit}`
            )
            if(response?.data?.success){
                dispatch(
                    setB2CEnquiriesByPage({
                        page,
                        data: response?.data?.allB2CEnquiries,
                        pagination: response?.data?.pagination,
                    })
                )
            }

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }


        
    // For getting accounts with paginated
    const getb2cEnquiryById = async (enquiryId) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${enquiriessEndpoints.GET_B2C_ENQUIRY_BY_ID}/${enquiryId}`
            )
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

        
    // For getting accounts with paginated
    const updateB2BEnquiryById = async (enquiryDetails) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${enquiriessEndpoints.UPDATE_B2B_ENQUIRY_BY_ID}/${enquiryDetails?._id}`,enquiryDetails
            )

            if(response?.data?.success){
                dispatch(clearB2BEnquiries())
            }
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }
        
    // For getting accounts with paginated
    const updateB2CEnquiryById = async (enquiryDetails) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${enquiriessEndpoints.UPDATE_B2C_ENQUIRY_BY_ID}/${enquiryDetails?._id}`,enquiryDetails
            )

            if(response?.data?.success){
                dispatch(clearB2CEnquiries())
            }
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }
        
    // For getting accounts with paginated
    const deleteB2BEnquiryById = async (enquiryId) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "DELETE",
                `${enquiriessEndpoints.DELETE_B2B_ENQUIRY_BY_ID}/${enquiryId}`
            )

            if(response?.data?.success){
                dispatch(clearB2BEnquiries())
            }
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }
        
    // For getting accounts with paginated
    const deleteB2CEnquiryById = async (enquiryId) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "DELETE",
                `${enquiriessEndpoints.DELETE_B2C_ENQUIRY_BY_ID}/${enquiryId}`
            )

            if(response?.data?.success){
                dispatch(clearB2CEnquiries())
            }
            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }


    return {
        addEnquiryB2B,
        addEnquiryB2C,
        getb2bEnquiries,
        getb2cEnquiries,
        getb2bEnquiryById,
        getb2cEnquiryById,
        updateB2BEnquiryById,
        updateB2CEnquiryById,
        deleteB2BEnquiryById,
        deleteB2CEnquiryById
    };
};