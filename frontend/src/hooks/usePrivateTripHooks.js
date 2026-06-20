
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { privateTripEndpoints } from '../services/Apis/privateTripApis';
import { addNewPrivateTrip, setPrivateTripById, setPrivateTripFinanceById, setPrivateTripsByPage } from '../redux/slices/privateTripSlice';

export const usePrivateTripHooks = () => {
    const dispatch = useDispatch();
    const privateTripByPages = useSelector(s => s.privateTrip.privateTripByPages)
    const privateTripById = useSelector(s => s.privateTrip.privateTripById)

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
                        financeDetails: response?.data?.foundPrivateTripFinance
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

    // ─── Hook function ────────────────────────────────────────────────────────────
    // Drop-in replacement for updatePrivateTripHotelPaymentsRowWise inside
    // usePrivateTripHooks (or wherever the existing function lives).

    const updatePrivateTripHotelPaymentsRowWise = async (details) => {
        try {
            dispatch(setLoading(true));

            const formData = new FormData();

            // ── required identifiers ──
            formData.append("privateTripId", details.privateTripId);
            formData.append("financeId", details.financeId);
            formData.append("hotelId", details.hotelId ?? "");   // null-safe
            formData.append("hotelName", details.hotelName);
            formData.append("paymentIndex", details.paymentIndex);

            // ── updated scalar fields ──
            const { amount, date, mode, status } = details.updatedFields;
            formData.append("updatedFields[amount]", amount);
            formData.append("updatedFields[date]", date);
            formData.append("updatedFields[mode]", mode);
            formData.append("updatedFields[status]", status);


            if (details.receipt) {
                formData.append("receipt[action]", details.receipt.action);
                formData.append("receipt[previousReceipt]", details.receipt.previousReceipt ?? "");

                // Only append the actual File object when replacing
                if (details.receipt.action === "replace" && details.receipt.newFile instanceof File) {
                    formData.append("file", details.receipt.newFile);  // "file" matches add-controller key
                }
            }

            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.UPDATE_PRIVATE_TRIP_HOTEL_PAYMENTS_ROW_WISE}/${details.privateTripId}`,
                formData,
                { "Content-Type": "multipart/form-data" }
            );
            if (response?.data?.success) {
                dispatch(setPrivateTripFinanceById({
                    id: details.privateTripId,
                    data: response?.data?.data
                }))
            }

            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updatePrivateTripVehiclePaymentsRowWise = async (details) => {
        try {
            dispatch(setLoading(true));

            const formData = new FormData();

            // ── required identifiers ──
            formData.append("privateTripId", details.privateTripId);
            formData.append("financeId", details.financeId);
            formData.append("vehicleId", details.vehicleId);   // null-safe
            formData.append("paymentIndex", details.paymentIndex);

            // ── updated scalar fields ──
            const { amount, date, mode, status } = details.updatedFields;
            formData.append("updatedFields[amount]", amount);
            formData.append("updatedFields[date]", date);
            formData.append("updatedFields[mode]", mode);
            formData.append("updatedFields[status]", status);


            if (details.receipt) {
                formData.append("receipt[action]", details.receipt.action);
                formData.append("receipt[previousReceipt]", details.receipt.previousReceipt ?? "");

                // Only append the actual File object when replacing
                if (details.receipt.action === "replace" && details.receipt.newFile instanceof File) {
                    formData.append("file", details.receipt.newFile);  // "file" matches add-controller key
                }
            }

            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.UPDATE_PRIVATE_TRIP_VEHICLE_PAYMENTS_ROW_WISE}/${details.privateTripId}`,
                formData,
                { "Content-Type": "multipart/form-data" }
            );

            if (response?.data?.success) {
                dispatch(setPrivateTripFinanceById({
                    id: details.privateTripId,
                    data: response?.data?.data
                }))
            }

            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updatePrivateTripGuestPaymentsRowWise = async (details) => {
        try {
            dispatch(setLoading(true));

            const formData = new FormData();

            // ── required identifiers ──
            formData.append("privateTripId", details.privateTripId);
            formData.append("financeId", details.financeId);
            formData.append("paymentIndex", details.paymentIndex);

            // ── updated scalar fields ──
            const { amount, date, mode, status } = details.updatedFields;
            formData.append("updatedFields[amount]", amount);
            formData.append("updatedFields[date]", date);
            formData.append("updatedFields[mode]", mode);
            formData.append("updatedFields[status]", status);


            if (details.receipt) {
                formData.append("receipt[action]", details.receipt.action);
                formData.append("receipt[previousReceipt]", details.receipt.previousReceipt ?? "");

                // Only append the actual File object when replacing
                if (details.receipt.action === "replace" && details.receipt.newFile instanceof File) {
                    formData.append("file", details.receipt.newFile);  // "file" matches add-controller key
                }
            }

            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.UPDATE_PRIVATE_TRIP_GUEST_PAYMENTS_ROW_WISE}/${details.privateTripId}`,
                formData,
                { "Content-Type": "multipart/form-data" }
            );

            if (response?.data?.success) {
                dispatch(setPrivateTripFinanceById({
                    id: details.privateTripId,
                    data: response?.data?.data
                }))
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


    const deletePrivateTripsHotelVehicle = async (details) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.DELETE_PRIVATE_TRIP_HOTEL_VEHICLE_PAYMENTS_ROW_WISE}/${details?.privateTripId}`, details
            )
            if (response?.data?.success) {
                dispatch(
                    setPrivateTripFinanceById({
                        id: details.privateTripId,
                        data: response?.data?.data,
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

    const deletePrivateTripsGuestPayment = async (details) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.DELETE_PRIVATE_TRIP_GUEST_PAYMENTS_ROW_WISE}/${details?.privateTripId}`, details
            )
            if (response?.data?.success) {
                dispatch(
                    setPrivateTripFinanceById({
                        id: details.privateTripId,
                        data: response?.data?.data,
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

    const updatePrivateTripById = async (details) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.UPDATE_PRIVATE_TRIP}/${details?.privateTripId}`, details
            )
            if (response?.data?.success) {
                dispatch(
                    setPrivateTripById({
                        id: details.privateTripId,
                        data: response?.data?.data,
                        financeDetails: response?.data?.data2
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

    const deleteUnusedHotelOrVehiclePrivateTrip = async (details) => {
        try {

            dispatch(setLoading(true))

            const response = await apiConnector(
                "PUT",
                `${privateTripEndpoints.DELETE_UNUSED_HOTEL_OR_VEHICLE}/${details?.privateTripId}`, details
            )
            if (response?.data?.success) {
                dispatch(
                    setPrivateTripFinanceById({
                        id: details.privateTripId,
                        data: response?.data?.data,
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
        getPrivateTripById,
        updatePrivateTripHotelPayments,
        updatePrivateTripHotelPaymentsRowWise,
        updatePrivateTripVehiclePayments,
        updatePrivateTripGuestPayments,
        updatePrivateTripVehiclePaymentsRowWise,
        updatePrivateTripGuestPaymentsRowWise,
        deletePrivateTripsHotelVehicle,
        deletePrivateTripsGuestPayment,
        updatePrivateTripById,
        deleteUnusedHotelOrVehiclePrivateTrip

    };
};