
import Vehicle from "../models/vehicle.model.js"


import mongoose from "mongoose";

export const addVehicle = async (req, res) => {
    try {
        const {
            contactNo,
            pricePerDay,
            regionId,
            transferPrice,
            vehicleImageUrl,
            vehicleModel,
            vehicleType,
            vendorName
        } = req.body;

        // ✅ Required fields validation
        if (!contactNo || !pricePerDay || !regionId || !vehicleModel || !vehicleType || !vendorName) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        // ✅ Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid regionId"
            });
        }

        // ✅ Convert values
        const orgId = new mongoose.Types.ObjectId(req.user.org_id);
        const regionObjId = new mongoose.Types.ObjectId(regionId);

        const parsedPricePerDay = Number(pricePerDay);
        const parsedTransferPrice = transferPrice ? Number(transferPrice) : undefined;
        const parsedContactNo = Number(contactNo);

        if (isNaN(parsedPricePerDay) || isNaN(parsedContactNo)) {
            return res.status(400).json({
                success: false,
                message: "Invalid number values"
            });
        }

        // ✅ Normalize strings (important for uniqueness)
        const displayModel = vehicleModel.trim();
        const normalizedModel = displayModel.toLowerCase();
        const normalizedVehicleType = vehicleType.trim();
        const normalizedVendorName = vendorName.trim();

        // ✅ Create vehicle
        const newVehicle = await Vehicle.create({
            org_id: orgId,
            regionId: regionObjId,
            contactNo: parsedContactNo,
            pricePerDay: parsedPricePerDay,
            transferPrice: parsedTransferPrice,
            vehicleImageUrl,
            vehicleModel: displayModel,
            vehicleModel_lower: normalizedModel,
            vehicleType: normalizedVehicleType,
            vendorName: normalizedVendorName
        });

        return res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            newVehicle
        });

    } catch (error) {
        // ✅ Handle duplicate key error properly
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: `Vehile already exists in this region`
            });
        }

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};