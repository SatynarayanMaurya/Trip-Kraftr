
import mongoose from "mongoose";
import Hotel from "../models/hotel.model.js"
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";



export const addHotel = async (req, res) => {
    try {
        const {
            hotelName,
            contact,
            email,
            category,
            address,
            googleRating,
            regionId,
            subRegionId,
            amenities
        } = req.body;

        const amenitiesArray = amenities ? JSON.parse(amenities) : [];

        // ✅ Basic validation
        if (!hotelName?.trim() || !contact || !regionId || !category) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        // ✅ Files (correct way)
        let images = req.files?.images || [];
        if (images && !Array.isArray(images)) {
            images = [images];
        }

        const MAX_SIZE = 1 * 1024 * 1024; // 2MB

        // ✅ Validate image size
        for (const file of images) {
            if (file.size > MAX_SIZE) {
                return res.status(400).json({
                    success: false,
                    message: "Each image must be less than 1 MB"
                });
            }
        }

        // ✅ Upload images
        let uploadedImages = [];

        if (images.length > 0) {
            const uploadResults = await Promise.allSettled(
                images.map((file) =>
                    uploadImageToCloudinary(file, process.env.HOTEL_IMAGES)
                )
            );

            uploadedImages = uploadResults
                .filter(r => r.status === "fulfilled")
                .map(r => ({
                    url: r.value.secure_url,
                    public_id: r.value.public_id,
                    size: r.value.size
                }));
        }

        // ✅ Build data object cleanly
        const data = {
            hotelName: hotelName.trim(),
            amenities: amenitiesArray,
            hotelName_lower: hotelName.trim().toLowerCase(),
            contact,
            category,
            org_id: new mongoose.Types.ObjectId(req.user.org_id),
            regionId: new mongoose.Types.ObjectId(regionId)
        };

        if (email) data.email = email.trim();
        if (address) data.address = address.trim();
        if (subRegionId) data.subRegionId = new mongoose.Types.ObjectId(subRegionId);
        if (googleRating !== undefined && googleRating !== '') {
            data.googleRating = Number(googleRating);
        }
        if (uploadedImages.length > 0) data.images = uploadedImages;

        // ✅ Create hotel
        const newHotel = await Hotel.create(data);

        await newHotel.populate([
            { path: "regionId", select: "_id name country" },
            { path: "subRegionId", select: "_id name" }
        ]);

        return res.status(201).json({
            success: true,
            message: "Hotel added successfully",
            newHotel
        });

    } catch (error) {

        // ✅ Duplicate error (optional since index exists)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Hotel already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};


export const getHotels = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit

        if (!req.user.org_id) {
            return res.status(401).json({
                success: false,
                message: "Organization id not found"
            })
        }

        // Fetch regions with pagination
        const allHotels = await Hotel
            .find({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .select("_id regionId subRegionId hotelName category contact is_active")
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" });

        // Counts
        const [totalHotel, activeHotel] = await Promise.all([
            Hotel.countDocuments({ org_id: req.user.org_id }),
            Hotel.countDocuments({ org_id: req.user.org_id, is_active: true })
        ])

        const inactiveHotel = totalHotel - activeHotel
        const totalPages = Math.ceil(totalHotel / limit)

        return res.status(200).json({
            success: true,
            message: "All Hotels fetched successfully",
            allHotels,

            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalHotel
            },
            stats: {
                totalHotel,
                activeHotel,
                inactiveHotel
            }
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}

export const getHotelById = async (req, res) => {
    try {
        const { hotelId } = req.params;

        if(!hotelId){
            return res.status(400).json({
                success:false,
                message:"Hotel Id not found"
            })
        }
        // Validate hotelId as a proper MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(hotelId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Hotel ID"
            });
        }

        // Fetch the hotel (org_id is already validated in middleware)
        const foundHotel = await Hotel
            .findOne({ org_id: req.user.org_id, _id: hotelId })
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" });

        if (!foundHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hotel found",
            data: foundHotel
        });

    } catch (error) {
        console.error("Error fetching hotel:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};


// Search Hotels for org
export const searchHotels = async (req, res) => {
    try {
        const { search, category, regionId, subRegionId, pageLimit } = req.query;
        const query = {
            org_id: req.user.org_id
        };

        if (search) {
            query.hotelName_lower = { $regex: `^${search.trim()}`, $options: "i" };
        }
        if (regionId) {
            query.regionId = new mongoose.Types.ObjectId(regionId)
        }
        if (subRegionId) {
            query.subRegionId = new mongoose.Types.ObjectId(subRegionId)
        }
        if (category !== 'All') {
            query.category = category
        }

        const searchedHotels = await Hotel
            .find(query)
            .limit(pageLimit || 5)
            .select("_id regionId subRegionId hotelName category contact is_active")
            .populate({ path: "regionId", select: "_id name country" })
            .populate({ path: "subRegionId", select: "_id name" });

        return res.status(200).json({
            success: true,
            message: "Searched Hotel founded",
            searchedHotels
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}