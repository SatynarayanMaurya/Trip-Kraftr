
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { privateTripEndpoints } from '../services/Apis/privateTripApis';
import { addNewPrivateTrip, setPrivateTripById, setPrivateTripFinanceById, setPrivateTripsByPage } from '../redux/slices/privateTripSlice';

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

    const updatePrivateTripHotelPayments = async (details) => {
        try {
            dispatch(setLoading(true));
    
            const formData = new FormData();
    
            formData.append("financeId", details.financeId);
            formData.append("hotelId", details.hotelId);
            formData.append("hotelName", details.hotelName);
    
            // Send payments array
            details.payments.forEach((payment, index) => {
                formData.append(`payments[${index}][amount]`, payment.amount);
                formData.append(`payments[${index}][date]`, payment.date);
                formData.append(`payments[${index}][mode]`, payment.mode);
                formData.append(`payments[${index}][status]`, payment.status);
    
                if (payment.file) {
                    formData.append(`payments[${index}][file]`, payment.file);
                }
            });
    
            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.UPDATE_PRIVATE_TRIP_HOTEL_PAYMENTS}/${details.privateTripId}`,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                }
            );

            if (response?.data?.success) {
                dispatch(
                    setPrivateTripFinanceById({
                        id: details.privateTripId,
                        data: response?.data?.data,
                    })
                )
            }
    
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updatePrivateTripVehiclePayments = async (details) => {
        try {
            dispatch(setLoading(true));
    
            const formData = new FormData();
    
            formData.append("financeId", details.financeId);
            formData.append("vehicleId", details.vehicleId);
            formData.append("vendorName", details.vendorName);
    
            // Send payments array
            details.payments.forEach((payment, index) => {
                formData.append(`payments[${index}][amount]`, payment.amount);
                formData.append(`payments[${index}][date]`, payment.date);
                formData.append(`payments[${index}][mode]`, payment.mode);
                formData.append(`payments[${index}][status]`, payment.status);
    
                if (payment.file) {
                    formData.append(`payments[${index}][file]`, payment.file);
                }
            });
    
            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.UPDATE_PRIVATE_TRIP_VEHICLE_PAYMENTS}/${details.privateTripId}`,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                }
            );

            if (response?.data?.success) {
                dispatch(
                    setPrivateTripFinanceById({
                        id: details.privateTripId,
                        data: response?.data?.data,
                    })
                )
            }
    
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updatePrivateTripGuestPayments = async (details) => {
        try {
            dispatch(setLoading(true));
    
            const formData = new FormData();
    
            formData.append("financeId", details.financeId);
    
            // Send payments array
            details.payments.forEach((payment, index) => {
                formData.append(`payments[${index}][amount]`, payment.amount);
                formData.append(`payments[${index}][date]`, payment.date);
                formData.append(`payments[${index}][mode]`, payment.mode);
                formData.append(`payments[${index}][status]`, payment.status);
    
                if (payment.file) {
                    formData.append(`payments[${index}][file]`, payment.file);
                }
            });
    
            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.UPDATE_PRIVATE_TRIP_GUEST_PAYMENTS}/${details.privateTripId}`,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                }
            );

            if (response?.data?.success) {
                dispatch(
                    setPrivateTripFinanceById({
                        id: details.privateTripId,
                        data: response?.data?.data,
                    })
                )
            }
    
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        addPrivateTrip,
        getPrivateTrips,
        getPrivateTripById,
        updatePrivateTripHotelPayments,
        updatePrivateTripVehiclePayments,
        updatePrivateTripGuestPayments

    };
};