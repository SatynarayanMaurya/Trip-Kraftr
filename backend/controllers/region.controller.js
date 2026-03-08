

import Region from "../models/region.model.js"
import MasterRegion from "../models/masterRegions.model.js"


export const addRegion = async (req, res) => {
    try {
        const { name, description, country, min_margin, max_margin } = req.body

        const org_id = req.user.org_id;

        if (!name || !country || !min_margin || !max_margin) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            })
        }

        if (!org_id) {
            return res.status(400).json({
                success: false,
                message: "Organization id not found"
            })
        }
        if (Number(min_margin) > Number(max_margin)) {
            return res.status(400).json({
                success: false,
                message: "Min margin cannot be greater than max margin"
            })
        }

        const existingRegion = await Region.findOne({ org_id, name })
        if (existingRegion) {
            return res.status(409).json({
                success: false,
                message: "Region already exist"
            })
        }

        const newRegion = await Region.create({ name, org_id, description, country, min_margin: Number(min_margin), max_margin: Number(max_margin), updatedBy: req.user.userId })
        return res.status(201).json({
            success: true,
            message: "Region added successfully",
            newRegion
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server error"
        })
    }
}


export const getRegions = async (req, res) => {
    try {
        const org_id = req.user.org_id
        if (!org_id) {
            return res.status(400).json({
                success: false,
                message: "Organization id not found"
            })
        }
        const regions = await Region.find({ org_id }).sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            message: "All Regions fetched",
            regions
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error"
        })
    }
}



//Super Admin Controllers 

export const addMasterRegion = async (req, res) => {
    try {
        const { region, country } = req.body;

        if (!region || !country) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing "
            })
        }
        const existingRegion = await MasterRegion.findOne({ country, name: region })
        if (existingRegion) {
            return res.status(409).json({
                success: false,
                message: `The region '${region}' already exists for the selected country.`
            })
        }
        const newMasterRegion = await MasterRegion.create({ name: region, country, updatedBy: req.user.userId })
        return res.status(201).json({
            success: true,
            message: "Master Region created successfully",
            newMasterRegion
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error"
        })
    }
}

export const getMasterRegions = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit

        // Fetch regions with pagination
        const allMasterRegion = await MasterRegion
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Counts
        const [totalRegion, activeRegion] = await Promise.all([
            MasterRegion.countDocuments(),
            MasterRegion.countDocuments({ is_active: true })
        ])

        const inactiveRegion = totalRegion - activeRegion
        const totalPages = Math.ceil(totalRegion / limit)

        return res.status(200).json({
            success: true,
            message: "All Master Regions fetched successfully",
            allMasterRegion,

            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalRegion
            },
            stats: {
                totalRegion,
                activeRegion,
                inactiveRegion
            }
        })

    } catch (error) {
        console.error("Get Master Regions Error:", error)

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}


// GET /api/master-regions/search?search=maharashtra&filter=Active
export const searchMasterRegions = async (req, res) => {
    const { search, filter } = req.query
    console.log("Search and filter : ", search, filter)
    const query = {}

    // if (search) query.$or = [
    //   { name: { $regex: search, $options: "i" } },
    //   { country: { $regex: search, $options: "i" } }
    // ]
    // Prefix search (starts with)
    if (search) {
        query.$or = [
            { name: { $regex: `^${search}`, $options: "i" } },
            { country: { $regex: `^${search}`, $options: "i" } }
        ]
    }
    if (filter === 'Active') query.is_active = true
    else if (filter === 'Inactive') query.is_active = false

    const searchedMasterRegion = await MasterRegion.find(query).sort({ createdAt: -1 }).limit(5)


    return res.status(200).json({
        success: true,
        message: "Master Regions search results",
        searchedMasterRegion,
    })
}