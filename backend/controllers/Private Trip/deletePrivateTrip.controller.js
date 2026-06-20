import PrivateTripFinance from "../../models/Private Trip/privateTripfinances.model.js";
import { deleteImageFromCloudinary } from "../../utils/uploadToCloudinary.js";

export const deleteHotelVehiclePaymentRowWise = async (req, res) => {
    try {
        const {
            financeId,
            hotelId,
            hotelName,
            vehicleId,
            paymentIndex,
        } = req.body;

        const { privateTripId } = req.params

        if (!financeId || !privateTripId) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }

        if ((!hotelId || !hotelName) && !vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Choose which payment you want to delete"
            })
        }

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

        // Decide which array to work on
        const isVehicle = !!vehicleId;

        const paymentArray = isVehicle
            ? finance.vehiclePayments
            : finance.hotelPayments

        const itemIndex = paymentArray.findIndex((item) =>
            isVehicle
                ? item.vehicleId?._id?.toString() === vehicleId
                : item.hotelId?.toString() === hotelId || item.hotelName === hotelName
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: isVehicle
                    ? "Vehicle payment record not found"
                    : "Hotel payment record not found",
            });
        }

        const paymentDetails = paymentArray[itemIndex];

        if (
            paymentIndex < 0 ||
            paymentIndex >= paymentDetails.payments.length
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment index",
            });
        }

        // Amount before deletion
        const deletedPayment = paymentDetails.payments[paymentIndex];
        // Delete receipt from cloudinary if exists
        if (deletedPayment?.receiptPublicId) {
            try {
                await deleteImageFromCloudinary(deletedPayment.receiptPublicId);
            } catch (cloudinaryError) {
                console.error(
                    `Failed to delete receipt from Cloudinary: ${deletedPayment.receiptPublicId}`,
                    cloudinaryError
                );

                // Continue payment deletion even if image deletion fails
            }
        }

        // Remove payment
        paymentDetails.payments.splice(paymentIndex, 1);

        // Recalculate amounts
        if (deletedPayment?.status === "Paid") {
            paymentDetails.paidAmount =
                Number(paymentDetails.paidAmount || 0) -
                Number(deletedPayment.amount || 0);
        }

        paymentDetails.balanceAmount =
            Number(paymentDetails.price || 0) -
            Number(paymentDetails.paidAmount || 0);

        await finance.save();

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
            data: finance,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};



export const deleteGuestPaymentRowWise = async (req, res) => {
    try {
        const { privateTripId } = req.params;
        const { financeId, paymentIndex } = req.body;

        if (
            !privateTripId ||
            !financeId ||
            paymentIndex === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        const finance = await PrivateTripFinance.findOne({
            org_id: req.user.org_id,
            privateTripId,
            _id: financeId,
        });

        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance not found",
            });
        }

        const guestPayments = finance.guestPayments;

        if (!guestPayments) {
            return res.status(404).json({
                success: false,
                message: "Guest payment details not found",
            });
        }

        if (
            paymentIndex < 0 ||
            paymentIndex >= guestPayments.payments.length
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment index",
            });
        }

        const deletedPayment =
            guestPayments.payments[paymentIndex];

        // Delete receipt from cloudinary if exists
        const existingPublicId =
            deletedPayment?.receiptPublicId;

        if (existingPublicId) {
            try {
                await deleteImageFromCloudinary(
                    existingPublicId
                );
            } catch (cloudinaryError) {
                console.error(
                    `Cloudinary deletion failed for ${existingPublicId}:`,
                    cloudinaryError?.message
                );

                // Continue payment deletion
            }
        }

        // Remove payment
        guestPayments.payments.splice(paymentIndex, 1);

        // Recalculate amounts
        if (deletedPayment?.status === "Paid") {
            guestPayments.paidAmount =
                Number(guestPayments.paidAmount || 0) -
                Number(deletedPayment.amount || 0);
        }

        guestPayments.balanceAmount =
            Number(guestPayments.price || 0) -
            Number(guestPayments.paidAmount || 0);

        await finance.save();

        return res.status(200).json({
            success: true,
            message: "Guest payment deleted successfully",
            data: finance,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error?.message || "Internal Server Error",
        });
    }
};


export const deleteUnusedHotelOrVehicle = async (req, res) => {
    try {
        const {
            financeId,
            hotelId,
            hotelName,
            vehicleId,
        } = req.body;

        const { privateTripId } = req.params;

        if (!financeId || !privateTripId) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing",
            });
        }

        if ((!hotelId && !hotelName) && !vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Choose which payment you want to delete",
            });
        }

        const finance = await PrivateTripFinance.findOne({
            org_id: req.user.org_id,
            privateTripId,
            _id: financeId,
        }).populate({
            path: "vehiclePayments.vehicleId",
            select: "_id vendorName contactNo vehicleImageUrl",
        });

        if (!finance) {
            return res.status(404).json({
                success: false,
                message: "Finance record not found",
            });
        }

        // Delete Vehicle Payment
        if (vehicleId) {
            const vehicleIndex = finance.vehiclePayments.findIndex(
                (item) =>
                    item?.vehicleId?._id?.toString() === vehicleId ||
                    item?.vehicleId?.toString() === vehicleId
            );

            if (vehicleIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Vehicle payment not found",
                });
            }

            finance.vehiclePayments.splice(vehicleIndex, 1);
        }

        // Delete Hotel Payment
        else {
            const hotelIndex = finance.hotelPayments.findIndex((item) => {
                if (hotelId) {
                    return item?.hotelId?.toString() === hotelId;
                }

                return item?.hotelName?.trim() === hotelName?.trim();
            });

            if (hotelIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Hotel payment not found",
                });
            }

            finance.hotelPayments.splice(hotelIndex, 1);
        }

        await finance.save();

        const updatedFinance = await PrivateTripFinance.findById(finance._id)
            .populate({
                path: "vehiclePayments.vehicleId",
                select: "_id vendorName contactNo vehicleImageUrl",
            });

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
            data: updatedFinance,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};