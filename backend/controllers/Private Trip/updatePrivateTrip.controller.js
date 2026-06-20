import mongoose from "mongoose";
import PrivateTrip from "../../models/Private Trip/privateTrip.model.js"
import PrivateTripFinance from "../../models/Private Trip/privateTripfinances.model.js";
import { uploadImageToCloudinary } from "../../utils/uploadToCloudinary.js";

export const AddHotelPayments = async (req, res) => {
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
        const paidValue = parsedPayments.reduce(
            (acc, val) => acc + (val?.status === 'Paid' ? Number(val?.amount) : 0),
            0
        );

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

            finance.hotelPayments[hotelIndex].balanceAmount = finance.hotelPayments[hotelIndex]?.balanceAmount - paidValue
            finance.hotelPayments[hotelIndex].paidAmount = finance.hotelPayments[hotelIndex]?.paidAmount + paidValue
        } else {
            finance.hotelPayments.push({
                hotelId: new mongoose.Types.ObjectId(hotelId),
                hotelName,
                payments: paymentsToInsert,
                balanceAmount: 0,
                paidAmount: paidValue
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
        const paidValue = parsedPayments.reduce(
            (acc, val) => acc + (val?.status === 'Paid' ? Number(val?.amount) : 0),
            0
        );

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
            finance.vehiclePayments[vehicleIndex].balanceAmount = finance.vehiclePayments[vehicleIndex]?.balanceAmount - paidValue
            finance.vehiclePayments[vehicleIndex].paidAmount = finance.vehiclePayments[vehicleIndex]?.paidAmount + paidValue
        } else {
            finance.vehiclePayments.push({
                vehicleId: new mongoose.Types.ObjectId(vehicleId),
                payments: paymentsToInsert,
                balanceAmount: 0,
                paidAmount: paidValue
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
        const paidValue = parsedPayments.reduce(
            (acc, val) => acc + (val?.status === 'Paid' ? Number(val?.amount) : 0),
            0
        );
        console.log("paid value : ", paidValue)

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

        const uploadPromises = parsedPayments?.map((_, index) => {
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
        finance.guestPayments.balanceAmount = finance.guestPayments.balanceAmount - Number(paidValue)
        finance.guestPayments.paidAmount = finance.guestPayments.paidAmount + Number(paidValue)

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


// controllers/privateTripFinance.controller.js  (only this function shown)

export const updateHotelPaymentsRowWise = async (req, res) => {
    try {
        const { privateTripId } = req.params;

        // ── 1. Parse body ──────────────────────────────────────────────────
        const { financeId, hotelId, hotelName, paymentIndex } = req.body;

        if (!financeId || !privateTripId || !hotelName || paymentIndex === undefined) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing (financeId, privateTripId, hotelName, paymentIndex)",
            });
        }

        const index = Number(paymentIndex);
        if (isNaN(index) || index < 0) {
            return res.status(400).json({
                success: false,
                message: "paymentIndex must be a non-negative number",
            });
        }

        // ── 2. Parse updatedFields ─────────────────────────────────────────
        // Sent as updatedFields[amount], updatedFields[date], etc.
        const rawFields = {};
        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^updatedFields\[(.+)\]$/);
            if (match) rawFields[match[1]] = req.body[key];
        });

        const { amount, date, mode, status } = rawFields;

        if (!amount || !date || !mode || !status) {
            return res.status(400).json({
                success: false,
                message: "updatedFields must include amount, date, mode and status",
            });
        }

        // ── 3. Parse receipt instructions (optional) ───────────────────────
        const receiptAction = req.body["receipt[action]"] ?? null;  // "replace" | "remove" | null
        const previousReceiptUrl = req.body["receipt[previousReceipt]"] ?? null;
        const incomingFile = req.files?.["file"] ?? null;

        // ── 4. Load finance record ─────────────────────────────────────────
        const finance = await PrivateTripFinance.findOne({ org_id: req.user.org_id, privateTripId, _id: financeId, })
            .populate({
                path: "vehiclePayments.vehicleId",
                select: "_id vendorName contactNo vehicleImageUrl",
            });

        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance record not found",
            });
        }

        // ── 5. Locate hotel ────────────────────────────────────────────────
        const hotelIdx = finance.hotelPayments.findIndex(
            (h) => h.hotelId?.toString() === hotelId || h.hotelName === hotelName
        );

        if (hotelIdx === -1) {
            return res.status(404).json({
                success: false,
                message: `Hotel "${hotelName}" not found in finance record`,
            });
        }

        const hotelEntry = finance.hotelPayments[hotelIdx];
        const findPayment = hotelEntry?.payments?.[index];
        if (findPayment?.amount !== Number(amount) || findPayment?.status !== status) {
            // Need to modified the balance and paid
            if (findPayment?.status !== status) {
                if (status === 'Paid') {
                    finance.hotelPayments[hotelIdx].balanceAmount = finance.hotelPayments[hotelIdx].balanceAmount - Number(amount)
                    finance.hotelPayments[hotelIdx].paidAmount = finance.hotelPayments[hotelIdx].paidAmount + Number(amount)
                }
                else {
                    finance.hotelPayments[hotelIdx].balanceAmount = finance.hotelPayments[hotelIdx].balanceAmount + findPayment?.amount
                    finance.hotelPayments[hotelIdx].paidAmount = finance.hotelPayments[hotelIdx].paidAmount - findPayment?.amount

                }
            }
            else {
                if (status === 'Paid') {
                    finance.hotelPayments[hotelIdx].balanceAmount = finance.hotelPayments[hotelIdx].balanceAmount + findPayment?.amount - Number(amount)
                    finance.hotelPayments[hotelIdx].paidAmount = finance.hotelPayments[hotelIdx].paidAmount - findPayment?.amount + Number(amount)

                }
            }
        }

        if (index >= hotelEntry.payments.length) {
            return res.status(400).json({
                success: false,
                message: `paymentIndex ${index} is out of range (hotel has ${hotelEntry.payments.length} payments)`,
            });
        }

        // ── 6. Handle receipt ──────────────────────────────────────────────
        let newReceiptUrl = hotelEntry.payments[index].receipt ?? null;
        let newReceiptPublicId = hotelEntry.payments[index].receiptPublicId ?? null;

        if (receiptAction === "replace" || receiptAction === "remove") {

            // Delete previous image from Cloudinary if a public ID is stored
            const existingPublicId = hotelEntry.payments[index].receiptPublicId ?? null;
            if (existingPublicId) {
                try {
                    await deleteImageFromCloudinary(existingPublicId);
                } catch (deleteErr) {
                    // Log but don't block the update — old asset may already be gone
                    console.error("Cloudinary delete failed:", deleteErr?.message);
                }
            }

            if (receiptAction === "replace" && incomingFile) {
                // Validate file size (1 MB limit — same as add controller)
                if (incomingFile.size > 1024 * 1024) {
                    return res.status(400).json({
                        success: false,
                        message: `${incomingFile.name} exceeds the 1 MB limit`,
                    });
                }

                const uploaded = await uploadImageToCloudinary(
                    incomingFile,
                    process.env.HOTEL_RECEIPT
                );

                newReceiptUrl = uploaded.secure_url;
                newReceiptPublicId = uploaded.public_id;

            } else {
                // "remove" or "replace" with no file provided → clear receipt
                newReceiptUrl = null;
                newReceiptPublicId = null;
            }
        }
        // If receiptAction is null (no receipt[action] sent) we leave the
        // existing receipt/receiptPublicId untouched.

        // ── 7. Apply updates ───────────────────────────────────────────────
        finance.hotelPayments[hotelIdx].payments[index] = {
            ...hotelEntry.payments[index].toObject(),   // keep any extra fields (_id etc.)
            date: new Date(date),
            amount: Number(amount),
            mode,
            status,
            receipt: newReceiptUrl,
            receiptPublicId: newReceiptPublicId,
        };

        finance.markModified(`hotelPayments.${hotelIdx}.payments`);
        await finance.save();

        return res.status(200).json({
            success: true,
            message: "Hotel payment updated successfully",
            data: finance,
        });

    } catch (error) {
        console.error("updateHotelPaymentsRowWise error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};
// Replaces the empty stub for updateHotelPaymentsRowWise.

export const updateVehiclePaymentsRowWise = async (req, res) => {
    try {
        const { privateTripId } = req.params;

        // ── 1. Parse body ──────────────────────────────────────────────────
        const { financeId, vehicleId, paymentIndex } = req.body;

        if (!financeId || !privateTripId || !vehicleId || paymentIndex === undefined) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing (financeId, privateTripId, hotelName, paymentIndex)",
            });
        }

        const index = Number(paymentIndex);
        if (isNaN(index) || index < 0) {
            return res.status(400).json({
                success: false,
                message: "paymentIndex must be a non-negative number",
            });
        }

        // ── 2. Parse updatedFields ─────────────────────────────────────────
        // Sent as updatedFields[amount], updatedFields[date], etc.
        const rawFields = {};
        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^updatedFields\[(.+)\]$/);
            if (match) rawFields[match[1]] = req.body[key];
        });

        const { amount, date, mode, status } = rawFields;

        if (!amount || !date || !mode || !status) {
            return res.status(400).json({
                success: false,
                message: "updatedFields must include amount, date, mode and status",
            });
        }

        // ── 3. Parse receipt instructions (optional) ───────────────────────
        // Sent as receipt[action] and receipt[previousReceipt].
        // The actual file (if any) arrives in req.files["file"].
        const receiptAction = req.body["receipt[action]"] ?? null;  // "replace" | "remove" | null
        const previousReceiptUrl = req.body["receipt[previousReceipt]"] ?? null;
        const incomingFile = req.files?.["file"] ?? null;

        // ── 4. Load finance record ─────────────────────────────────────────
        const finance = await PrivateTripFinance.findOne({ org_id: req.user.org_id, privateTripId, _id: financeId, })
            .populate({
                path: "vehiclePayments.vehicleId",
                select: "_id vendorName contactNo vehicleImageUrl",
            });

        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance record not found",
            });
        }

        // ── 5. Locate hotel ────────────────────────────────────────────────
        // const hotelIdx = finance.vehiclePayments.findIndex(
        const vehicleIdx = finance.vehiclePayments.findIndex(
            (h) => h.vehicleId?._id?.toString() === vehicleId
        );

        if (vehicleIdx === -1) {
            return res.status(404).json({
                success: false,
                message: `Vehlcle  not found in finance record`,
            });
        }

        // const hotelEntry = finance.vehiclePayments[vehicleIdx];
        const vehicleEntry = finance.vehiclePayments[vehicleIdx];
        const findPayment = vehicleEntry?.payments?.[index];
        if (findPayment?.amount !== Number(amount) || findPayment?.status !== status) {
            // Need to modified the balance and paid
            if (findPayment?.status !== status) {
                if (status === 'Paid') {
                    finance.vehiclePayments[vehicleIdx].balanceAmount = finance.vehiclePayments[vehicleIdx].balanceAmount - Number(amount)
                    finance.vehiclePayments[vehicleIdx].paidAmount = finance.vehiclePayments[vehicleIdx].paidAmount + Number(amount)
                }
                else {
                    finance.vehiclePayments[vehicleIdx].balanceAmount = finance.vehiclePayments[vehicleIdx].balanceAmount + findPayment?.amount
                    finance.vehiclePayments[vehicleIdx].paidAmount = finance.vehiclePayments[vehicleIdx].paidAmount - findPayment?.amount

                }
            }
            else {
                if (status === 'Paid') {
                    finance.vehiclePayments[vehicleIdx].balanceAmount = finance.vehiclePayments[vehicleIdx].balanceAmount + findPayment?.amount - Number(amount)
                    finance.vehiclePayments[vehicleIdx].paidAmount = finance.vehiclePayments[vehicleIdx].paidAmount - findPayment?.amount + Number(amount)

                }
            }
        }

        if (index >= vehicleEntry.payments.length) {
            return res.status(400).json({
                success: false,
                message: `paymentIndex ${index} is out of range (hotel has ${vehicleEntry.payments.length} payments)`,
            });
        }

        // ── 6. Handle receipt ──────────────────────────────────────────────
        let newReceiptUrl = vehicleEntry.payments[index].receipt ?? null;
        let newReceiptPublicId = vehicleEntry.payments[index].receiptPublicId ?? null;

        if (receiptAction === "replace" || receiptAction === "remove") {

            // Delete previous image from Cloudinary if a public ID is stored
            const existingPublicId = vehicleEntry.payments[index].receiptPublicId ?? null;
            if (existingPublicId) {
                try {
                    await deleteImageFromCloudinary(existingPublicId);
                } catch (deleteErr) {
                    // Log but don't block the update — old asset may already be gone
                    console.error("Cloudinary delete failed:", deleteErr?.message);
                }
            }

            if (receiptAction === "replace" && incomingFile) {
                // Validate file size (1 MB limit — same as add controller)
                if (incomingFile.size > 1024 * 1024) {
                    return res.status(400).json({
                        success: false,
                        message: `${incomingFile.name} exceeds the 1 MB limit`,
                    });
                }

                const uploaded = await uploadImageToCloudinary(
                    incomingFile,
                    process.env.VEHICLE_RECEIPT
                );

                newReceiptUrl = uploaded.secure_url;
                newReceiptPublicId = uploaded.public_id;

            } else {
                // "remove" or "replace" with no file provided → clear receipt
                newReceiptUrl = null;
                newReceiptPublicId = null;
            }
        }
        // If receiptAction is null (no receipt[action] sent) we leave the
        // existing receipt/receiptPublicId untouched.

        // ── 7. Apply updates ───────────────────────────────────────────────
        finance.vehiclePayments[vehicleIdx].payments[index] = {
            ...vehicleEntry.payments[index].toObject(),   // keep any extra fields (_id etc.)
            date: new Date(date),
            amount: Number(amount),
            mode,
            status,
            receipt: newReceiptUrl,
            receiptPublicId: newReceiptPublicId,
        };

        finance.markModified(`vehiclePayments.${vehicleIdx}.payments`);
        await finance.save();

        return res.status(200).json({
            success: true,
            message: "Vehicle payment updated successfully",
            data: finance,
        });

    } catch (error) {
        console.error("updateVehiclePaymentsRowWise error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};

export const updateGuestPaymentsRowWise = async (req, res) => {
    try {
        const { privateTripId } = req.params;

        // ── 1. Parse body ──────────────────────────────────────────────────
        const { financeId, paymentIndex } = req.body;

        if (!financeId || !privateTripId || paymentIndex === undefined) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing (financeId, privateTripId, paymentIndex)",
            });
        }

        const index = Number(paymentIndex);
        if (isNaN(index) || index < 0) {
            return res.status(400).json({
                success: false,
                message: "paymentIndex must be a non-negative number",
            });
        }

        // ── 2. Parse updatedFields ─────────────────────────────────────────
        // Sent as updatedFields[amount], updatedFields[date], etc.
        const rawFields = {};
        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^updatedFields\[(.+)\]$/);
            if (match) rawFields[match[1]] = req.body[key];
        });

        const { amount, date, mode, status } = rawFields;

        if (!amount || !date || !mode || !status) {
            return res.status(400).json({
                success: false,
                message: "updatedFields must include amount, date, mode and status",
            });
        }

        // ── 3. Parse receipt instructions (optional) ───────────────────────
        // Sent as receipt[action] and receipt[previousReceipt].
        // The actual file (if any) arrives in req.files["file"].
        const receiptAction = req.body["receipt[action]"] ?? null;  // "replace" | "remove" | null
        const previousReceiptUrl = req.body["receipt[previousReceipt]"] ?? null;
        const incomingFile = req.files?.["file"] ?? null;

        // ── 4. Load finance record ─────────────────────────────────────────
        const finance = await PrivateTripFinance.findOne({ _id: financeId, privateTripId })
            .populate({
                path: "vehiclePayments.vehicleId",
                select: "_id vendorName contactNo vehicleImageUrl",
            });

        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance record not found",
            });
        }


        const findPayment = finance?.guestPayments?.payments?.[index];
        if (findPayment?.amount !== Number(amount) || findPayment?.status !== status) {
            // Need to modified the balance and paid
            if (findPayment?.status !== status) {
                if (status === 'Paid') {
                    finance.guestPayments.balanceAmount = finance?.guestPayments?.balanceAmount - Number(amount)
                    finance.guestPayments.paidAmount = finance?.guestPayments?.paidAmount + Number(amount)
                }
                else {
                    finance.guestPayments.balanceAmount = finance?.guestPayments?.balanceAmount + findPayment?.amount
                    finance.guestPayments.paidAmount = finance?.guestPayments?.paidAmount - findPayment?.amount

                }
            }
            else {
                if (status === 'Paid') {
                    finance.guestPayments.balanceAmount = finance?.guestPayments?.balanceAmount + findPayment?.amount - Number(amount)
                    finance.guestPayments.paidAmount = finance?.guestPayments?.paidAmount - findPayment?.amount + Number(amount)

                }
            }
        }


        // ── 6. Handle receipt ──────────────────────────────────────────────
        let newReceiptUrl = finance?.guestPayments?.payments[index].receipt ?? null;
        let newReceiptPublicId = finance?.guestPayments?.payments[index].receiptPublicId ?? null;

        if (receiptAction === "replace" || receiptAction === "remove") {

            // Delete previous image from Cloudinary if a public ID is stored
            const existingPublicId = finance?.guestPayments?.payments[index].receiptPublicId ?? null;
            if (existingPublicId) {
                try {
                    await deleteImageFromCloudinary(existingPublicId);
                } catch (deleteErr) {
                    // Log but don't block the update — old asset may already be gone
                    console.error("Cloudinary delete failed:", deleteErr?.message);
                }
            }

            if (receiptAction === "replace" && incomingFile) {
                // Validate file size (1 MB limit — same as add controller)
                if (incomingFile.size > 1024 * 1024) {
                    return res.status(400).json({
                        success: false,
                        message: `${incomingFile.name} exceeds the 1 MB limit`,
                    });
                }

                const uploaded = await uploadImageToCloudinary(
                    incomingFile,
                    process.env.GUEST_RECEIPT
                );

                newReceiptUrl = uploaded.secure_url;
                newReceiptPublicId = uploaded.public_id;

            } else {
                // "remove" or "replace" with no file provided → clear receipt
                newReceiptUrl = null;
                newReceiptPublicId = null;
            }
        }
        // ── 7. Apply updates ───────────────────────────────────────────────
        finance.guestPayments.payments[index] = {
            date: new Date(date),
            amount: Number(amount),
            mode,
            status,
            receipt: newReceiptUrl,
            receiptPublicId: newReceiptPublicId,
        };

        finance.markModified(`guestPayments payments`);
        await finance.save();

        return res.status(200).json({
            success: true,
            message: "Guest payment updated successfully",
            data: finance,
        });

    } catch (error) {
        console.error("updateGuestPaymentsRowWise error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};

const calculateHotelPrice = (rooms) => {

    return rooms.reduce((roomAcc, room) => {

        const roomPrice = (room?.roomPrice || 0) * (room?.noOfRooms || 1);

        const extraMattressPrice = (room?.extraMattressPrice || 0) * (room?.noOfExtraMattress || 0);

        const cnbPrice = (room?.cnbPrice || 0) * (room?.noOfCnb || 0);

        return (
            roomAcc +
            roomPrice +
            extraMattressPrice +
            cnbPrice
        );
    }, 0);
}

export const updatePrivateTrip = async (req, res) => {
    try {

        const { privateTripId } = req.params;
        const { regionDetails, itineraryBuilder, price } = req.body;

        if (!privateTripId || !regionDetails || !itineraryBuilder || !price) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            });
        }

        const existingPrivateTrip = await PrivateTrip.findOne({
            org_id: req.user.org_id,
            _id: privateTripId
        });

        if (!existingPrivateTrip) {
            return res.status(404).json({
                success: false,
                message: "Private Trip Not Found"
            });
        }

        const existingPrivateTripFinance = await PrivateTripFinance.findOne({
            org_id: req.user.org_id,
            privateTripId
        });

        if (!existingPrivateTripFinance) {
            return res.status(404).json({
                success: false,
                message: "Private Trip Finance Not Found"
            });
        }

        // ==========================================
        // HOTELS
        // ==========================================

        const allHotels = itineraryBuilder?.daysDetails?.map((val) =>
            val?.hotelDetails?.hotelType === "inventory"
                ? {
                    hotelId: val?.hotelDetails?.hotelId,
                    hotelName: val?.hotelDetails?.hotelName,
                    price: calculateHotelPrice(val?.hotelDetails?.rooms)
                }
                : {
                    hotelId: null,
                    hotelName: val?.hotelDetails?.hotelName,
                    price: calculateHotelPrice(val?.hotelDetails?.rooms)
                }
        );

        const mergedHotels = Object.values(
            allHotels.reduce((acc, hotel) => {

                if (!hotel?.hotelId && !hotel?.hotelName) {
                    return acc;
                }

                const key = hotel.hotelId || hotel.hotelName;

                if (!acc[key]) {
                    acc[key] = {
                        hotelId: hotel.hotelId,
                        hotelName: hotel.hotelName,
                        price: 0
                    };
                }

                acc[key].price += hotel.price || 0;

                return acc;
            }, {})
        );

        // ==========================================
        // VEHICLES
        // ==========================================

        const allVehicles = itineraryBuilder?.daysDetails?.flatMap(day =>
            day?.vehicleDetails
                ?.filter(vehicle => vehicle?.vehicleId)
                .map(vehicle => ({
                    vehicleModel: vehicle?.vehicleModel,
                    vehicleId: vehicle?.vehicleId,
                    price: vehicle?.pricePerDay
                })) || []
        );

        const mergedVehicles = Object.values(
            allVehicles.reduce((acc, vehicle) => {

                const { vehicleId, vehicleModel, price } = vehicle;

                if (!acc[vehicleId]) {
                    acc[vehicleId] = {
                        vehicleId,
                        vehicleModel,
                        price: 0
                    };
                }

                acc[vehicleId].price += price || 0;

                return acc;
            }, {})
        );

        // ==========================================
        // HOTEL FINANCE SYNC
        // ==========================================

        let updatedHotelPayments = [
            ...existingPrivateTripFinance.hotelPayments
        ];

        for (const incomingHotel of mergedHotels) {

            const existingIndex = updatedHotelPayments.findIndex(dbHotel => {

                if (incomingHotel.hotelId && dbHotel.hotelId) {
                    return (
                        String(incomingHotel.hotelId) ===
                        String(dbHotel.hotelId)
                    );
                }

                return (
                    !incomingHotel.hotelId &&
                    !dbHotel.hotelId &&
                    incomingHotel.hotelName === dbHotel.hotelName
                );
            });

            if (existingIndex !== -1) {

                updatedHotelPayments[existingIndex].price =
                    incomingHotel.price;

                updatedHotelPayments[existingIndex].balanceAmount =
                    Math.max(
                        0,
                        incomingHotel.price -
                        (updatedHotelPayments[existingIndex].paidAmount || 0)
                    );

                updatedHotelPayments[existingIndex].isActive = true;

            } 
            else {

                updatedHotelPayments.push({
                    hotelId: incomingHotel.hotelId || undefined,
                    hotelName: incomingHotel.hotelName,
                    price: incomingHotel.price,
                    balanceAmount: incomingHotel.price,
                    paidAmount: 0,
                    payments: [],
                    isActive: true
                });
            }
        }

        updatedHotelPayments = updatedHotelPayments.filter(dbHotel => {

            const existsInIncoming = mergedHotels.some(incomingHotel => {

                if (incomingHotel.hotelId && dbHotel.hotelId) {
                    return (
                        String(incomingHotel.hotelId) ===
                        String(dbHotel.hotelId)
                    );
                }

                return (
                    !incomingHotel.hotelId &&
                    !dbHotel.hotelId &&
                    incomingHotel.hotelName === dbHotel.hotelName
                );
            });

            if (existsInIncoming) {
                return true;
            }

            if ((dbHotel.paidAmount || 0) > 0) {
                dbHotel.isActive = false;
                return true;
            }

            return false;
        });

        // ==========================================
        // VEHICLE FINANCE SYNC
        // ==========================================

        let updatedVehiclePayments = [
            ...existingPrivateTripFinance.vehiclePayments
        ];

        for (const incomingVehicle of mergedVehicles) {

            const existingIndex = updatedVehiclePayments.findIndex(
                dbVehicle =>
                    String(dbVehicle.vehicleId) ===
                    String(incomingVehicle.vehicleId)
            );

            if (existingIndex !== -1) {

                updatedVehiclePayments[existingIndex].price =
                    incomingVehicle.price;

                updatedVehiclePayments[existingIndex].balanceAmount =
                    Math.max(
                        0,
                        incomingVehicle.price -
                        (updatedVehiclePayments[existingIndex].paidAmount || 0)
                    );

                updatedVehiclePayments[existingIndex].isActive = true;

            } else {

                updatedVehiclePayments.push({
                    vehicleId: incomingVehicle.vehicleId,
                    price: incomingVehicle.price,
                    balanceAmount: incomingVehicle.price,
                    paidAmount: 0,
                    payments: [],
                    isActive: true
                });
            }
        }

        updatedVehiclePayments = updatedVehiclePayments.filter(dbVehicle => {

            const existsInIncoming = mergedVehicles.some(
                incomingVehicle =>
                    String(incomingVehicle.vehicleId) ===
                    String(dbVehicle.vehicleId)
            );

            if (existsInIncoming) {
                return true;
            }

            if ((dbVehicle.paidAmount || 0) > 0) {
                dbVehicle.isActive = false;
                return true;
            }

            return false;
        });

        // ==========================================
        // GUEST PAYMENT SYNC
        // ==========================================

        const updatedGuestPayments = {
            ...existingPrivateTripFinance.guestPayments,
            price: price?.discountedPrice,
            balanceAmount: Math.max(
                0,
                price?.discountedPrice -
                (existingPrivateTripFinance?.guestPayments?.paidAmount || 0)
            )
        };

        // ==========================================
        // UPDATE FINANCE
        // ==========================================

        const updatedPrivateTripFinance = await PrivateTripFinance.findByIdAndUpdate(
            existingPrivateTripFinance._id,
            {
                hotelPayments: updatedHotelPayments,
                vehiclePayments: updatedVehiclePayments,
                guestPayments: updatedGuestPayments
            },
            {
                new: true
            }
        )
            .populate({
                path: 'vehiclePayments.vehicleId',
                select: "_id vendorName contactNo vehicleImageUrl"
            })

        // ==========================================
        // UPDATE TRIP
        // ==========================================

        const updatedPrivateTrip = await PrivateTrip.findByIdAndUpdate(
            privateTripId,
            {
                regionDetails,
                itineraryBuilder,
                price
            },
            {
                new: true
            }
        )
            .populate({
                path: 'enquiryId',
                select: "_id accountId",
                populate: {
                    path: 'accountId',
                    select: "_id fullName businessName email phone source" // choose fields you need
                }
            })
            .populate({ path: 'regionDetails.region1', select: "_id name" })
            .populate({ path: 'regionDetails.region2', select: "_id name" })
            .populate({ path: 'regionDetails.region3', select: "_id name" })
            .populate({ path: 'itineraryBuilder.daysDetails.subRegion1', select: "_id name" })
            .populate({ path: 'itineraryBuilder.daysDetails.subRegion2', select: "_id name" })
            .populate({ path: 'itineraryBuilder.daysDetails.subRegion3', select: "_id name" })

        return res.status(200).json({
            success: true,
            message: "Private Trip Updated Successfully",
            data: updatedPrivateTrip,
            data2: updatedPrivateTripFinance,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};