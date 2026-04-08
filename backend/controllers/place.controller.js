
import Place from "../models/place.model.js"
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";
import mongoose from "mongoose";

export const addPlace = async (req, res) => {
    try {
        const {
            placeName,
            regionId,
            subRegionId,
            category,
            mapLink,
            description,
            notes
        } = req.body;

        // ✅ Basic validation
        if (!placeName?.trim() || !regionId || !category) {
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

        const cleanedPlaceName = placeName.trim();

        // ✅ Image handling
        const image = req?.files?.image;
        let imageUrl = null;
        let imagePublicId = null;

        if (image) {
            const response = await uploadImageToCloudinary(
                image,
                process.env.PLACE_IMAGES
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
            placeName: cleanedPlaceName,
            regionId,
            category
        };

        if (subRegionId) payload.subRegionId = subRegionId;
        if (mapLink) payload.mapLink = mapLink;
        if (description) payload.description = description;
        if (notes) payload.notes = notes;
        if (imageUrl) payload.imageUrl = imageUrl;
        if (imagePublicId) payload.imagePublicId = imagePublicId;

        // ✅ Create place
        const newPlace = await Place.create(payload);

        await newPlace.populate([
            { path: "regionId", select: "_id name country" },
            { path: "subRegionId", select: "_id name" }
        ]);
        return res.status(201).json({
            success: true,
            message: "Place Added Successfully",
            newPlace
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Place already exists in this region"
            });
        }

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};


export const getPlaces = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit;

        const allPlaces = await Place
            .find({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .select("_id regionId subRegionId placeName notes category")
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" })

        // Counts
        const totalPlace = await Place.countDocuments({ org_id: req.user.org_id })

        const totalPages = Math.ceil(totalPlace / limit)

        return res.status(200).json({
            success: true,
            message: "All Places fetched successfully",
            allPlaces,

            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalPlace
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


export const searchPlaces = async (req, res) => {
    try {
        const { search, regionId, pageLimit = 10 } = req.query;

        const query = {
            org_id: req.user.org_id // filter by org first for performance
        };
        if (regionId) {
            const regionObjId = new mongoose.Types.ObjectId(regionId);
            query.regionId = regionObjId;
        }

        // Prefix search (starts with search term)
        if (search) {
            query.placeName = { $regex: `^${search.trim()}`, $options: "i" };
        }

        // Find and limit results
        const searchedPlaces = await Place
            .find(query)
            .sort({ createdAt: -1 })
            .limit(pageLimit)
            .select("_id regionId subRegionId placeName notes category")
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" })

        return res.status(200).json({
            success: true,
            message: "Subregion search results",
            searchedPlaces,
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
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: "Place Id is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(placeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Place Id",
            });
        }

        const deletedPlace = await Place.findOneAndDelete({
            org_id: req.user.org_id,
            _id: placeId,
        });

        if (!deletedPlace) {
            return res.status(404).json({
                success: false,
                message: "Place not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Place deleted successfully",
            deletedPlace,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};