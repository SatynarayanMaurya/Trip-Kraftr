import mongoose from "mongoose";
import PrivateTripFinance from "../../models/Private Trip/privateTripfinances.model.js";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary.js";

export const updateHotelPayments = async (req, res) => {
    try {
        const { privateTripId } = req.params;

        const {
            financeId,
            hotelId,
            hotelName,
        } = req.body;

        if (!financeId || !privateTripId || !hotelId || !hotelName) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        // =========================
        // Parse Payments
        // =========================

        const paymentMap = {};

        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^payments\[(\d+)\]\[(.+)\]$/);

            if (match) {
                const index = Number(match[1]);
                const field = match[2];

                if (!paymentMap[index]) {
                    paymentMap[index] = {};
                }

                paymentMap[index][field] = req.body[key];
            }
        });

        const parsedPayments = Object.values(paymentMap);

        if (!parsedPayments.length) {
            return res.status(400).json({
                success: false,
                message: "At least one payment is required",
            });
        }

        // =========================
        // Validate File Size
        // =========================

        const files = req.files || {};

        for (const file of Object.values(files)) {
            if (file.size > 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: `${file.name} exceeds 1 MB limit`,
                });
            }
        }

        // =========================
        // Upload Receipts
        // =========================

        const uploadPromises = parsedPayments.map((_, index) => {
            const file = files[`payments[${index}][file]`];

            if (!file) return Promise.resolve(null);

            return uploadImageToCloudinary(
                file,
                process.env.HOTEL_RECEIPT
            );
        });

        const uploadResults = await Promise.allSettled(uploadPromises);

        // =========================
        // Attach Receipt Details
        // =========================

        const paymentsToInsert = parsedPayments.map((payment, index) => {
            const uploadResult = uploadResults[index];

            const paymentData = {
                date: payment.date,
                amount: Number(payment.amount),
                mode: payment.mode,
                status: payment.status,
            };

            if (
                uploadResult?.status === "fulfilled" &&
                uploadResult?.value
            ) {
                paymentData.receipt =
                    uploadResult.value.secure_url;

                paymentData.receiptPublicId =
                    uploadResult.value.public_id;
            }

            return paymentData;
        });

        // =========================
        // Finance Record
        // =========================

        const finance = await PrivateTripFinance.findOne({
            _id: financeId,
            privateTripId,
        })
            .populate({
                path: 'vehiclePayments.vehicleId',
                select: "_id vendorName contactNo vehicleImageUrl"
            })

        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance record not found",
            });
        }

        // =========================
        // Find Existing Hotel
        // =========================

        const hotelIndex = finance.hotelPayments.findIndex(
            (hotel) =>
                hotel.hotelId?.toString() === hotelId || hotel.hotelName === hotelName
        );

        if (hotelIndex > -1) {
            finance.hotelPayments[hotelIndex].payments.push(
                ...paymentsToInsert
            );
        } else {
            finance.hotelPayments.push({
                hotelId: new mongoose.Types.ObjectId(hotelId),
                hotelName,
                payments: paymentsToInsert,
            });
        }

        await finance.save();

        return res.status(200).json({
            success: true,
            message: "Hotel payments updated successfully",
            data: finance,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};

export const updateVehicleVendorPayments = async (req, res) => {
    try {
        const { privateTripId } = req.params;

        const {
            financeId,
            vehicleId,
            vendorName,
        } = req.body;

        if (!financeId || !privateTripId || !vehicleId || !vendorName) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        // =========================
        // Parse Payments
        // =========================

        const paymentMap = {};

        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^payments\[(\d+)\]\[(.+)\]$/);

            if (match) {
                const index = Number(match[1]);
                const field = match[2];

                if (!paymentMap[index]) {
                    paymentMap[index] = {};
                }

                paymentMap[index][field] = req.body[key];
            }
        });

        const parsedPayments = Object.values(paymentMap);

        if (!parsedPayments.length) {
            return res.status(400).json({
                success: false,
                message: "At least one payment is required",
            });
        }

        // =========================
        // Validate File Size
        // =========================

        const files = req.files || {};

        for (const file of Object.values(files)) {
            if (file.size > 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: `${file.name} exceeds 1 MB limit`,
                });
            }
        }

        // =========================
        // Upload Receipts
        // =========================

        const uploadPromises = parsedPayments.map((_, index) => {
            const file = files[`payments[${index}][file]`];

            if (!file) return Promise.resolve(null);

            return uploadImageToCloudinary(
                file,
                process.env.VEHICLE_RECEIPT
            );
        });

        const uploadResults = await Promise.allSettled(uploadPromises);

        // =========================
        // Attach Receipt Details
        // =========================

        const paymentsToInsert = parsedPayments.map((payment, index) => {
            const uploadResult = uploadResults[index];

            const paymentData = {
                date: payment.date,
                amount: Number(payment.amount),
                mode: payment.mode,
                status: payment.status,
            };

            if (
                uploadResult?.status === "fulfilled" &&
                uploadResult?.value
            ) {
                paymentData.receipt =
                    uploadResult.value.secure_url;

                paymentData.receiptPublicId =
                    uploadResult.value.public_id;
            }

            return paymentData;
        });

        // =========================
        // Finance Record
        // =========================

        const finance = await PrivateTripFinance.findOne({
            _id: financeId,
            privateTripId,
        })


        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance record not found",
            });
        }

        // =========================
        // Find Existing Hotel
        // =========================

        const vehicleIndex = finance.vehiclePayments.findIndex(
            (vehicle) =>
                vehicle.vehicleId?.toString() === vehicleId
        );

        if (vehicleIndex > -1) {
            finance.vehiclePayments[vehicleIndex].payments.push(
                ...paymentsToInsert
            );
        } else {
            finance.vehiclePayments.push({
                vehicleId: new mongoose.Types.ObjectId(vehicleId),
                payments: paymentsToInsert,
            });
        }

        await finance.save();

        await finance.populate({
            path: "vehiclePayments.vehicleId",
            select: "_id vendorName contactNo vehicleImageUrl",
        });

        return res.status(200).json({
            success: true,
            message: "Vehicle payments updated successfully",
            data: finance,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};


export const updateGuestPayments = async (req, res) => {
    try {
        const { privateTripId } = req.params;

        const { financeId } = req.body;

        if (!financeId || !privateTripId) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        // =========================
        // Parse Payments
        // =========================

        const paymentMap = {};

        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^payments\[(\d+)\]\[(.+)\]$/);

            if (match) {
                const index = Number(match[1]);
                const field = match[2];

                if (!paymentMap[index]) {
                    paymentMap[index] = {};
                }

                paymentMap[index][field] = req.body[key];
            }
        });

        const parsedPayments = Object.values(paymentMap);

        if (!parsedPayments.length) {
            return res.status(400).json({
                success: false,
                message: "At least one payment is required",
            });
        }

        // =========================
        // Validate File Size
        // =========================

        const files = req.files || {};

        for (const file of Object.values(files)) {
            if (file.size > 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: `${file.name} exceeds 1 MB limit`,
                });
            }
        }

        // =========================
        // Upload Receipts
        // =========================

        const uploadPromises = parsedPayments.map((_, index) => {
            const file = files[`payments[${index}][file]`];

            if (!file) return Promise.resolve(null);

            return uploadImageToCloudinary(
                file,
                process.env.GUEST_RECEIPT
            );
        });

        const uploadResults = await Promise.allSettled(uploadPromises);

        // =========================
        // Attach Receipt Details
        // =========================

        const paymentsToInsert = parsedPayments.map((payment, index) => {
            const uploadResult = uploadResults[index];

            const paymentData = {
                date: payment.date,
                amount: Number(payment.amount),
                mode: payment.mode,
                status: payment.status,
            };

            if (uploadResult?.status === "fulfilled" && uploadResult.value) {
                paymentData.receipt = uploadResult.value.secure_url;
                paymentData.receiptPublicId = uploadResult.value.public_id;
            }

            return paymentData;
        });

        // =========================
        // Finance Record
        // =========================

        const finance = await PrivateTripFinance.findOne({
            _id: financeId,
            privateTripId,
        });

        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance record not found",
            });
        }

        // =========================
        // Append Guest Payments (ONLY ONE LEVEL)
        // =========================

        if (!finance.guestPayments) {
            finance.guestPayments.payments = [];
        }

        finance.guestPayments.payments.push(...paymentsToInsert);

        await finance.save();
        
        await finance.populate({
            path: "vehiclePayments.vehicleId",
            select: "_id vendorName contactNo vehicleImageUrl",
        });

        return res.status(200).json({
            success: true,
            message: "Guest payments updated successfully",
            data: finance,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};