
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { policyEndpoints } from '../services/Apis/policiesApis';
import { deletePolicyReducer, setPoliciesByRegion } from '../redux/slices/policySlice';

export const usePolicyHooks = () => {
    const dispatch = useDispatch();
    const policiesByRegion = useSelector((state) => state.policy.policiesByRegion)

    const addPolicy = async (policyDeatils) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", policyEndpoints.ADD_POLICY, policyDeatils)
            dispatch(
                setPoliciesByRegion({
                    category: response?.data?.updatedDoc?.policyCategory,
                    policyDetails: response?.data?.updatedDoc,
                    regionId: response?.data?.updatedDoc?.regionId?._id
                })
            )
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    // For getting place with paginated
    const getPolicies = async (policyCategory, regionId) => {
        try {
            const cachedPage = policiesByRegion?.[policyCategory]?.[regionId]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${policyEndpoints.GET_POLICY}?regionId=${regionId}&policyCategory=${policyCategory}`
            )
            dispatch(
                setPoliciesByRegion({
                    category: policyCategory,
                    policyDetails: response?.data?.findPolicy,
                    regionId: regionId
                })
            )

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    // For getting place with paginated
    const getPoliciesForRegion = async ( regionId) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${policyEndpoints.GET_POLICY_FOR_REGION}?regionId=${regionId}`
            )

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    // For getting place with paginated
    const updatePolicy = async (policyDetails) => {
        try {
            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${policyEndpoints.UPDATE_POLICY}`,
                policyDetails
            )

            dispatch(
                setPoliciesByRegion({
                    category: response?.data?.updatedDoc?.policyCategory,
                    policyDetails: response?.data?.updatedDoc,
                    regionId: response?.data?.updatedDoc?.regionId?._id
                })
            )

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    // For getting place with paginated
    const deletePolicy = async (regionId, deleteIndex, policyCategory) => {
        try {
            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${policyEndpoints.DELETE_POLICY}`,
                {regionId, deleteIndex, policyCategory}
            )


            if(response?.data?.success){
                dispatch(
                    deletePolicyReducer({
                        category: policyCategory,
                        regionId: regionId,
                        index: deleteIndex
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



    return {
        addPolicy,
        getPolicies,
        getPoliciesForRegion,
        updatePolicy,
        deletePolicy
    };
};