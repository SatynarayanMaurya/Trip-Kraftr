
import Region from "../models/region.model.js"
import SubRegion from "../models/subRegion.model.js"
import  mongoose from 'mongoose';


export const addSubRegion = async (req, res) => {
  try {
    const { regionId, name, description } = req.body;

    if (!regionId || !name) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!req.user.org_id) {
      return res.status(401).json({
        success: false,
        message: "Organization id not found",
      });
    }

    // 2️⃣ Convert string IDs to ObjectId
    const orgId = new mongoose.Types.ObjectId(req.user.org_id);
    const regionObjId = new mongoose.Types.ObjectId(regionId);
    const trimmedName = name?.trim();

    const newSubRegion = await SubRegion.create({
      org_id: orgId,
      regionId: regionObjId,
      name: trimmedName,
      description,
    });

    await newSubRegion.populate({path:"regionId",select:"_id name country is_active"})

    return res.status(201).json({
      success: true,
      message: "Subregion created successfully",
      newSubRegion,
    });

  } catch (err) {
    // 5️⃣ Handle duplicate key error
    if (err.code === 11000) {
      const subregionName = err.keyValue.name;
      return res.status(409).json({
        success: false,
        message: `Subregion "${subregionName}" already exists in this region`,
      });
    }

    // 6️⃣ Handle other unexpected errors
    return res.status(500).json({
      success: false,
      message: err.message||"Something went wrong",
    });
  }
};


export const getSubRegions = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit

        if(!req.user.org_id){
          return res.status(401).json({
            success:false,
            message:"Organization id not found"
          })
        }

        // Fetch regions with pagination
        const allSubRegion = await SubRegion
            .find({org_id:req.user.org_id})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .populate({path:"regionId",select:"_id name country"})

        // Counts
        const [totalSubRegion, activeSubRegion] = await Promise.all([
            SubRegion.countDocuments({org_id:req.user.org_id}),
            SubRegion.countDocuments({ is_active: true,org_id:req.user.org_id })
        ])

        const inactiveSubRegion = totalSubRegion - activeSubRegion
        const totalPages = Math.ceil(totalSubRegion / limit)

        return res.status(200).json({
            success: true,
            message: "All sub Regions fetched successfully",
            allSubRegion,

            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalSubRegion
            },
            stats: {
                totalSubRegion,
                activeSubRegion,
                inactiveSubRegion
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}

export const getSubRegionById = async (req, res)=>{
  try{
    const { subRegionId} = req.params;
    if(!subRegionId){
      return res.status(400).json({
        success:false,
        message:"Sub Region Id not found"
      })
    }
    if(!req.user.org_id){
      return res.status(401).json({
        success:false,
        message:"Organization id not found"
      })
    }

    const findSubRegion = await SubRegion.findOne({org_id:req.user.org_id,_id:subRegionId}).populate({path:"regionId",select:"_id name country"})
    return res.status(200).json({
      success:true,
      message:"Sub Region finded",
      findSubRegion
    })
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:error?.message || "Internal Server Error"
    })
  }
}

export const updateSubRegionById = async (req, res) => {
  try {
    const { subRegionId } = req.params;
    const { name, description, is_active } = req.body;

    if (!subRegionId || !mongoose.Types.ObjectId.isValid(subRegionId)) {
      return res.status(400).json({
        success: false,
        message: "Valid Sub Region Id is required",
      });
    }

    if (!req.user?.org_id) {
      return res.status(401).json({
        success: false,
        message: "Organization id not found",
      });
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description;
    if (is_active !== undefined) updateFields.is_active = is_active;

    const updatedSubRegion = await SubRegion.findOneAndUpdate(
      { org_id: req.user.org_id, _id: subRegionId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedSubRegion) {
      return res.status(404).json({
        success: false,
        message: "Sub Region not found",
      });
    }
    await updatedSubRegion.populate({path:"regionId",select:"_id name country"})
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      updatedSubRegion,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};


export const searchSubRegions = async (req, res) => {
  try {
    const { search, filter } = req.query;
    console.log("Filter : ",filter)

    if (!req.user.org_id) {
      return res.status(401).json({
        success: false,
        message: "Organization id not found"
      });
    }

    const query = {
      org_id: req.user.org_id // filter by org first for performance
    };

    // Prefix search (starts with search term)
    if (search) {
      query.name = { $regex: `^${search.trim()}`, $options: "i" };
    }

    // Filter by active/inactive
    if (filter === 'Active') query.is_active = true;
    else if (filter === 'Inactive') query.is_active = false;

    // Find and limit results
    const searchedSubRegions = await SubRegion
      .find(query)
      .sort({ createdAt: -1 })
      .limit(5).populate({path:"regionId",select:"_id name country is_active"})

    return res.status(200).json({
      success: true,
      message: "Subregion search results",
      searchedSubRegions,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message||"Something went wrong",
    });
  }
};

export const searchRegionForOrganization = async(req,res)=>{   // For adding the subregion we need to search region first
    try{
        const { regionName } = req.query;

        if (!req.user.org_id) {
          return res.status(401).json({
            success: false,
            message: "Org id not found"
          });
        }
        
        const query = {
          org_id: req.user.org_id,
          is_active: true
        };
        
        if (regionName) {
          query.name = { $regex: `${regionName}`, $options: "i" };
        }
        
        const searchedRegions = await Region
          .find(query)
          .sort({ createdAt: -1 })
          .limit(5);
        
        return res.status(200).json({
          success: true,
          message: "Region searched",
          searchedRegions
        });
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal server error"
        })
    }

}
