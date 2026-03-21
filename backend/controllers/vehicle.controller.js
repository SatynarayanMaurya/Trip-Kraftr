
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

        await newVehicle.populate({path:'regionId',select:"_id name country is_active"})
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


export const getVehicle = async(req,res)=>{
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit

        // Fetch regions with pagination
        const allVehicles = await Vehicle
            .find({org_id:req.user.org_id})
            .select("_id regionId vehicleType vehicleModel vehicleImageUrl transferPrice pricePerDay is_active org_id contactNo")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .populate({path:"regionId",select:"_id name country is_active"})

        // Counts
        const [totalVehicle, activeVehicle] = await Promise.all([
            Vehicle.countDocuments(),
            Vehicle.countDocuments({ is_active: true })
        ])

        const inactiveVehicle = totalVehicle - activeVehicle
        const totalPages = Math.ceil(totalVehicle / limit)

        return res.status(200).json({
            success: true,
            message: "All Master Regions fetched successfully",
            allVehicles,

            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalVehicle
            },
            stats: {
                totalVehicle,
                activeVehicle,
                inactiveVehicle
            }
        })

    } 
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal server error"
        })
    }
}


export const searchVehicle = async(req,res)=>{
    try{
        const {search,sort,type, regionId,pageLimit} = req.query;
        const query = {
            org_id: req.user.org_id 
          };
      
          if (search) {
            query.vehicleModel = { $regex: `^${search.trim()}`, $options: "i" };
          }
          if(regionId){
            query.regionId = new mongoose.Types.ObjectId(regionId)
          }
          if(type!=='All Type'){
            query.vehicleType = type
          }
          const SORT_MAP = {
            "Recently Added": { createdAt: -1 },
            "Price: Low to High": { pricePerDay: 1 },
            "Price: High to Low": { pricePerDay: -1 },
            "Name: A to Z": { vehicleModel_lower: 1 }
          };
          const sortOption = SORT_MAP[sort] || { createdAt: -1 };

          const searchedVehicle = await Vehicle
          .find(query)
          .sort(sortOption)
          .limit(pageLimit||5)
          .select("_id regionId vehicleType vehicleModel vehicleImageUrl transferPrice pricePerDay is_active org_id contactNo")
          .populate({path:"regionId",select:"_id name country is_active"})

        return res.status(200).json({
            success:true,
            message:"Searched vehicle founded",
            searchedVehicle
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message|| "Internal Server Error"
        })
    }
}