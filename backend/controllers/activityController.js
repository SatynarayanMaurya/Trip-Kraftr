
import Activity from "../models/activity.model.js"
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";
import mongoose from "mongoose";

export const addActivity = async (req, res) => {
    try {
        const {
            activityName,
            regionId,
            regionName,
            subRegionId,
            category,
            price,
            description,
            notes
        } = req.body;

        // ✅ Basic validation
        if (!activityName?.trim() || !regionId || !category) {
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

        if (subRegionId && !mongoose.Types.ObjectId.isValid(subRegionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subRegionId"
            });
        }

        const cleanedActivityName = activityName.trim();

        // ✅ Image handling
        const image = req?.files?.image;
        let imageUrl = null;
        let imagePublicId = null;

        if (image) {
            const response = await uploadImageToCloudinary(
                image,
                process.env.ACTIVITY_IMAGES
            );

            if (!response?.secure_url) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to upload image"
                });
            }

            imageUrl = response.secure_url;
            imagePublicId = response.public_id;
        }

        // ✅ Build payload (ONLY allowed fields)
        const payload = {
            org_id: req.user.org_id,
            activityName: cleanedActivityName,
            regionId,
            regionName,
            category, price
        };

        if (subRegionId) payload.subRegionId = subRegionId;
        if (description) payload.description = description;
        if (notes) payload.notes = notes;
        if (imageUrl) payload.imageUrl = imageUrl;
        if (imagePublicId) payload.imagePublicId = imagePublicId;

        // ✅ Create place
        const newActivity = await Activity.create(payload);

        await newActivity.populate([
            { path: "regionId", select: "_id name country" },
            { path: "subRegionId", select: "_id name" }
        ]);
        return res.status(201).json({
            success: true,
            message: "Activity Added Successfully",
            newActivity
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Activity already exists in this region"
            });
        }

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};


export const getActivities = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit;

        const allActivities = await Activity
            .find({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .select("_id regionId subRegionId org_id activityName price notes category")
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" })

        // Counts
        const totalActivities = await Activity.countDocuments({ org_id: req.user.org_id })

        const totalPages = Math.ceil(totalActivities / limit)

        return res.status(200).json({
            success: true,
            message: "All Activities fetched successfully",
            allActivities,

            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalActivities
            },
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}

export const getPlaceById = async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: "Place Id not found"
            });
        }

        // ✅ ObjectId validation
        if (!mongoose.Types.ObjectId.isValid(placeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Place Id"
            });
        }

        const findPlace = await Place
            .findOne({ org_id: req.user.org_id, _id: placeId })
            .lean()
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" })

        if (!findPlace) {
            return res.status(404).json({
                success: false,
                message: "Place Not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Place found",
            findPlace
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};

export const updatePlaceById = async (req, res) => {
    try {
        const { placeId } = req.params;

        const {
            placeName,
            regionId,
            subRegionId,
            category,
            mapLink,
            description,
            notes
        } = req.body;

        if (!placeName?.trim() || !category || !regionId) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }

        const image = req?.files?.newImage;

        // ✅ Validate placeId
        if (!mongoose.Types.ObjectId.isValid(placeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Place Id"
            });
        }

        // ✅ Find existing place
        const existingPlace = await Place.findOne({
            org_id: req.user.org_id,
            _id: placeId
        });

        if (!existingPlace) {
            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }

        let imageUrl = existingPlace.imageUrl;
        let imagePublicId = existingPlace.imagePublicId;

        // ✅ Image handling
        if (image) {
            // delete old image
            if (imagePublicId) {
                await deleteImageFromCloudinary(imagePublicId);
            }

            const result = await uploadImageToCloudinary(
                image,
                process.env.PLACE_IMAGES
            );

            if (!result?.secure_url) {
                return res.status(400).json({
                    success: false,
                    message: "Image upload failed"
                });
            }

            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        // ✅ Build update payload dynamically
        const updatePayload = {};

        if (placeName?.trim()) updatePayload.placeName = placeName.trim();
        if (regionId && mongoose.Types.ObjectId.isValid(regionId)) {
            updatePayload.regionId = regionId;
        }
        if (subRegionId && mongoose.Types.ObjectId.isValid(subRegionId)) {
            updatePayload.subRegionId = subRegionId;
        }
        if (category) updatePayload.category = category;
        if (mapLink) updatePayload.mapLink = mapLink;
        if (description) updatePayload.description = description;
        if (notes) updatePayload.notes = notes;

        updatePayload.imageUrl = imageUrl;
        updatePayload.imagePublicId = imagePublicId;

        // ✅ Update
        const updatedPlace = await Place.findOneAndUpdate(
            { org_id: req.user.org_id, _id: placeId },
            { $set: updatePayload },
            { new: true }
        )
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Place Updated Successfully",
            updatedPlace
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};

export const searchActivity = async (req, res) => {
    try {
        const { search, regionId, pageLimit = 10 } = req.query;


        const query = {}
        query.org_id = req.user.org_id
        if (regionId) {
            const regionObjId = new mongoose.Types.ObjectId(regionId);
            query.regionId = regionObjId;
        }



        // Prefix search (starts with search term)
        if (search) {
            query.activityName = { $regex: `^${search.trim()}`, $options: "i" };
        }

        // Find and limit results

        const searchedActivities = await Activity
            .find(query)
            .sort({ createdAt: -1 })
            .limit(pageLimit)
            .select("_id regionId subRegionId price activityName notes category")
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" })

        return res.status(200).json({
            success: true,
            message: "Activity search results",
            searchedActivities,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
        });
    }
};



export const deletePlaceById = async (req, res) => {
    try {
        const { activityId } = req.params;

        if (!activityId) {
            return res.status(400).json({
                success: false,
                message: "Activity Id is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(activityId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Activity Id",
            });
        }

        // 🔥 Single DB query
        const deletedActivity = await Activity.findOneAndDelete({
            org_id: req.user.org_id,
            _id: activityId,
        });

        if (!deletedActivity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        // 🔥 Delete image AFTER DB success
        if (deletedActivity.public_id) {
            try {
                await deleteImageFromCloudinary(deletedActivity.public_id);
            } catch (err) {
                console.error("Cloudinary delete failed:", err.message);
                // optional: don't fail API because DB already deleted
            }
        }

        return res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
            deletedActivity,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};