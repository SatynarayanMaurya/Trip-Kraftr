
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { privateTripEndpoints } from '../services/Apis/privateTripApis';
import { addNewPrivateTrip, setPrivateTripById, setPrivateTripsByPage } from '../redux/slices/privateTripSlice';

export const usePrivateTripHooks = () => {
    const dispatch = useDispatch();
    const privateTripByPages = useSelector(s => s.privateTrip.privateTripByPages)
    const privateTripById = useSelector(s=>s.privateTrip.privateTripById)

    const addPrivateTrip = async (details) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", privateTripEndpoints.ADD_PRIVATE_TRIP, details)
            if (response?.data?.success) {
                dispatch(addNewPrivateTrip(response?.data?.newPrivateTrip))
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }


    const getPrivateTrips = async (page = 1, limit = 5) => {
        try {
            const cachedPage = privateTripByPages?.[page]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${privateTripEndpoints.GET_PRIVATE_TRIPS}?page=${page}&limit=${limit}`
            )
            if (response?.data?.success) {
                dispatch(
                    setPrivateTripsByPage({
                        page,
                        privateTrips: response?.data?.allPrivateTrips,
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



    const getPrivateTripById = async (privateTripId) => {
        try {
            const cachedPage = privateTripById?.[privateTripId]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${privateTripEndpoints.GET_PRIVATE_TRIP_BY_ID}/${privateTripId}`
            )


            if (response?.data?.success) {
                dispatch(
                    setPrivateTripById({
                        id: privateTripId,
                        data: response?.data?.foundPrivateTrip,
                        financeDetails:response?.data?.foundPrivateTripFinance
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
        addPrivateTrip,
        getPrivateTrips,
        getPrivateTripById

    };
};