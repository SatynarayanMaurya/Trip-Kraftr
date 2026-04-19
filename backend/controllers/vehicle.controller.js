
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
            capacity,
            vendorName
        } = req.body;

        // ✅ Required fields validation
        if (!contactNo || !pricePerDay || !regionId || !vehicleModel || !vehicleType || !vendorName || !capacity) {
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
            vendorName: normalizedVendorName,
            capacity:Number(capacity)
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
            .select("_id regionId vehicleType capacity vehicleModel vehicleImageUrl transferPrice pricePerDay is_active org_id contactNo")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .populate({path:"regionId",select:"_id name country is_active"})

        // Counts
        const [totalVehicle, activeVehicle] = await Promise.all([
            Vehicle.countDocuments({org_id:req.user.org_id}),
            Vehicle.countDocuments({org_id:req.user.org_id, is_active: true })
        ])

        const inactiveVehicle = totalVehicle - activeVehicle
        const totalPages = Math.ceil(totalVehicle / limit)
        const [topRegionData, topTypeData] = await Promise.all([
            Vehicle.aggregate([
              { $match: { org_id: new mongoose.Types.ObjectId(req.user.org_id) } },
              {
                $group: {
                  _id: "$regionId",
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 1 },
              {
                $lookup: {
                  from: "regions",
                  localField: "_id",
                  foreignField: "_id",
                  as: "region"
                }
              },
              { $unwind: "$region" },
              {
                $project: {
                  _id: 0,
                  regionId: "$region._id",
                  name: "$region.name",
                  country: "$region.country",
                  totalVehicles: "$count"
                }
              }
            ]),
          
            Vehicle.aggregate([
              { $match: { org_id: new mongoose.Types.ObjectId(req.user.org_id) } },
              {
                $group: {
                  _id: "$vehicleType",
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 1 },
              {
                $project: {
                  _id: 0,
                  vehicleType: "$_id",
                  totalVehicles: "$count"
                }
              }
            ])
          ]);

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
            },
            insights: {
                topRegion: topRegionData?.[0] || null,
                topVehicleType: topTypeData?.[0] || null
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
          .select("_id capacity regionId vehicleType vehicleModel vehicleImageUrl transferPrice pricePerDay is_active org_id contactNo")
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

export const updateVehicleById = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const {
      vehicleType,
      capacity,
      pricePerDay,
      transferPrice,
      vehicleImageUrl,
      vehicleModel,
      regionId
    } = req.body;

    // ✅ Validate vehicleId
    if (!vehicleId || !mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vehicle Id"
      });
    }

    // ✅ Validate regionId (if provided)
    let regionObjId;
    if (regionId) {
      if (!mongoose.Types.ObjectId.isValid(regionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Region Id"
        });
      }
      regionObjId = new mongoose.Types.ObjectId(regionId);
    }

    // ✅ Validate capacity
    if (capacity !== undefined && capacity === 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity cannot be 0"
      });
    }

    // ✅ Build update object safely (only defined fields)
    const updateData = {};

    if (vehicleType) updateData.vehicleType = vehicleType.trim();
    if (vehicleImageUrl !== undefined) updateData.vehicleImageUrl = vehicleImageUrl;

    if (vehicleModel) {
      const displayModel = vehicleModel.trim();
      updateData.vehicleModel = displayModel;
      updateData.vehicleModel_lower = displayModel.toLowerCase();
    }

    if (capacity !== undefined) updateData.capacity = Number(capacity);
    if (pricePerDay !== undefined) updateData.pricePerDay = Number(pricePerDay);
    if (transferPrice !== undefined) updateData.transferPrice = Number(transferPrice);

    if (regionObjId) updateData.regionId = regionObjId;

    // ✅ Update
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      {
        org_id: req.user.org_id,
        _id: vehicleId
      },
      { $set: updateData },
      { new: true } // return updated doc
    ).populate({
      path: "regionId",
      select: "_id name country is_active"
    });

    if (!updatedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      updatedVehicle
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    });
  }
};

export const deleteVehicleById = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const { regionId } = req.body;

        // Validate IDs
        if (!vehicleId || !mongoose.Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing vehicleId"
            });
        }

        if (!regionId || !mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing regionId"
            });
        }

        if (!req.user.org_id || !mongoose.Types.ObjectId.isValid(req.user.org_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid org_id"
            });
        }

        // Convert to ObjectId
        const vehicleObjectId = new mongoose.Types.ObjectId(vehicleId);
        const regionObjectId = new mongoose.Types.ObjectId(regionId);
        const orgObjectId = new mongoose.Types.ObjectId(req.user.org_id);

        const deletedVehicle = await Vehicle.findOneAndDelete({
            org_id: orgObjectId,
            regionId: regionObjectId,
            _id: vehicleObjectId,
        });

        if (!deletedVehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            deletedVehicle
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};


export const getVehiclesByRegionIds = async (req, res) => {
  try {
    const regionIds = req.query.regionIds.split(",");

    const allVehicles = await Vehicle
      .find({
        org_id: req.user.org_id,
        regionId: { $in: regionIds.map(id => new mongoose.Types.ObjectId(id)) },
        is_active:true
      })
      .sort({ createdAt: -1 })
      .lean()
      .select("_id capacity pricePerDay regionId vehicleImageUrl vehicleModel vehicleType")
      .populate({ path: "regionId", select: "_id name" });

    return res.status(200).json({
      success: true,
      message: "Filtered Vehicles fetched successfully",
      allVehicles
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    });
  }
};