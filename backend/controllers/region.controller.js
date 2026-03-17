

import Region from "../models/region.model.js"
import MasterRegion from "../models/masterRegions.model.js"
import RegionImage from "../models/region_images.model.js";
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";


export const addRegion = async (req, res) => {
    try {
        const {name, country,description, masterRegionId, min_margin, max_margin, region_images } = req.body

        const org_id = req.user.org_id;

        if (!masterRegionId || !min_margin || !max_margin) {
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

        const existingRegion = await Region.findOne({ org_id, masterRegionId })
        if (existingRegion) {
            return res.status(409).json({
                success: false,
                message: "Region already exist"
            })
        }

        const newRegion = await Region.create({name, country, org_id, description, region_images, masterRegionId, min_margin: Number(min_margin), max_margin: Number(max_margin), updatedBy: req.user.userId })
        await newRegion.populate({
            path: "masterRegionId",
            select: "name country _id is_active"
          });
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
        const regions = await Region.find({ org_id }).select("_id description is_active masterRegionId min_margin max_margin region_images").sort({ createdAt: -1 }).populate({ path: "masterRegionId", select: "_id country name is_active" })
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

export const getRegionById = async (req, res) => {
    try {
        const { regionId } = req.params
        if (!regionId) {
            return res.status(400).json({
                success: false,
                message: "Region Id not found"
            })
        }

        const org_id = req.user.org_id;
        if (!org_id) {
            return res.status(401).json({
                success: false,
                message: "Org Id not found"
            })
        }
        const findRegion = await Region.findOne({ org_id, _id: regionId }).populate({ path: "masterRegionId", select: "_id name country is_active" }).populate({path:"updatedBy",select:"name _id"})
        if (findRegion) {
            return res.status(200).json({
                success: true,
                message: "Region found",
                findRegion
            })
        }
        else {
            return res.status(404).json({
                success: true,
                message: "Region not found"
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server Error"
        })
    }
}

export const updateRegionById = async (req, res) => {
    try {
        const { regionId } = req.params;
        const orgId = req.user?.org_id; // get org_id from request body or authenticated user


        if (!regionId) {
            return res.status(400).json({
                success: false,
                message: "Region Id not found"
            });
        }

        if (!orgId) {
            return res.status(400).json({
                success: false,
                message: "Organization Id not found"
            });
        }

        const { description, region_images, min_margin, max_margin, is_active } = req.body;

        if (min_margin === undefined || max_margin === undefined) {
            return res.status(400).json({
                success: false,
                message: "Min margin and Max margin are required."
            });
        }

        if (parseFloat(min_margin) >= parseFloat(max_margin)) {
            return res.status(400).json({
                success: false,
                message: "Max margin must be greater than Min margin."
            });
        }

        const updatedRegion = await Region.findOneAndUpdate(
            { org_id: orgId, _id: regionId },
            { $set: { description, region_images, min_margin, max_margin, is_active } },
            { new: true }
        ).populate({ path: "masterRegionId", select: "_id country name is_active" })

        if (!updatedRegion) {
            return res.status(404).json({
                success: false,
                message: "Region not found or does not belong to your organization."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Region updated successfully",
            updatedRegion
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error"
        });
    }
};

export const deleteRegionById = async (req,res)=>{
    try{
        const {regionId} = req.params;
        if(!regionId){
            return res.status(400).json({
                success:false,
                message:"Region id not found"
            })
        }
        if(!req.user.org_id){
            return res.status(401).json({
                success:true,
                message:"Organization id not found"
            })
        }

        const deletedRegion = await Region.findOneAndDelete({org_id:req.user.org_id,_id:regionId})
        return res.status(200).json({
            success:true,
            message:"Region deleted successfully",
            deletedRegion
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message||"Internal server error"
        })
    }
}

// Both For country and region 
export const searchMasterRegions = async (req, res) => {
    const { search, filter } = req.query
    const query = {}

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

// Only for searching the country
export const searchMasterCountries = async (req, res) => {
    const { search } = req.query
    const query = {}

    if (search) {
        query.$or = [
            { country: { $regex: search, $options: "i" } }
        ]
    }
    query.is_active = true

    // const searchedMasterCountries = await MasterRegion.find(query).sort({ createdAt: -1 })
    const searchedMasterCountries = await MasterRegion.distinct("country", query);


    return res.status(200).json({
        success: true,
        message: "Countries search results",
        searchedMasterCountries,
    })
}
// Only for searching the regions only but the country is already selected
export const searchMasterRegionsOnly = async (req, res) => {
    const { countryName } = req.query


    const searchedMasterRegionsOnly = await MasterRegion.find({ country: countryName })


    return res.status(200).json({
        success: true,
        message: "Countries search results",
        searchedMasterRegionsOnly,
    })
}

// Fetching the region image according to the region id 
export const fetchRegionImages = async (req, res) => {
    try {
        const { regionId } = req.query;  // The region Id is masterRegion id 
        if (!regionId) {
            return res.status(400).json({
                success: false,
                message: "Region Id not found"
            })
        }

        const regionsImages = await RegionImage.findOne({ masterRegionId: regionId })
        return res.status(200).json({
            success: true,
            message: "Images fetched",
            regionsImages
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

// Get Master region with pagination
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

// export const addRegionImages = async (req, res) => {
//     try {
//         const { regionId, imageLinks } = req.body;
//         if (!regionId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Region id not found"
//             })
//         }
//         let parsedImageLinks = [];

//         if (imageLinks) {
//             try {
//                 parsedImageLinks = JSON.parse(imageLinks);
//             } catch (error) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid imageLinks format"
//                 });
//             }
//         }

//         const findExistingRegionImages = await RegionImage.findOne({ masterRegionId: regionId, })
//         if (findExistingRegionImages) {
//             return res.status(409).json({
//                 success: false,
//                 message: "You already uploaded image for this region"
//             })
//         }
//         // Normalize files
//         let images = req.files?.images
//         if (!images) {
//             return res.status(400).json({ success: false, message: "No images uploaded" });
//         }
//         if (!Array.isArray(images)) images = [images];
//         const MAX_SIZE = 2 * 1024 * 1024;

//         // Check image sizes
//         for (const file of images) {
//             if (file.size > MAX_SIZE) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Each image must be less than 2 MB",
//                 });
//             }
//         }

//         // Upload all images in parallel to Cloudinary
//         const uploadResults = await Promise.allSettled(
//             images.map((file) =>
//                 uploadImageToCloudinary(file, process.env.REGION_IMAGES).then((uploaded) => ({
//                     url: uploaded.secure_url,
//                     public_id: uploaded.public_id,
//                     size: uploaded.size,
//                 }))
//             )
//         );

//         // Separate successes and failures
//         const uploadedImages = uploadResults
//             .filter(result => result.status === "fulfilled")
//             .map(result => result.value);

//         const failedImages = uploadResults
//             .filter(result => result.status === "rejected")
//             .map((result, idx) => ({ fileName: images[idx].name, error: result.reason.message }));

//         if (uploadedImages.length === 0) {
//             return res.status(500).json({
//                 success: false,
//                 message: "All image uploads failed",
//                 errors: failedImages,
//             });
//         }

//         // Create new document with successfully uploaded images
//         const newRegionImages = await RegionImage.create({
//             masterRegionId: regionId,
//             images: uploadedImages,
//             updatedBy: req.user?.userId,
//             imageLinks: parsedImageLinks
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Images uploaded successfully",
//             newRegionImages,
//             failedImages, // optional: report which files failed
//         });
//     } catch (error) {
//         console.error("Add Region Images Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: error?.message || "Internal server error",
//         });
//     }
// };


export const addRegionImages = async (req, res) => {
    try {
      const { regionId, imageLinks } = req.body;
  
      if (!regionId) {
        return res.status(400).json({
          success: false,
          message: "Region id not found",
        });
      }
  
      let parsedImageLinks = [];
  
      if (imageLinks) {
        try {
          parsedImageLinks = JSON.parse(imageLinks);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid imageLinks format",
          });
        }
      }
  
      const existingRegionImages = await RegionImage.findOne({
        masterRegionId: regionId,
      });
  
      if (existingRegionImages) {
        return res.status(409).json({
          success: false,
          message: "You already uploaded images for this region",
        });
      }
  
      // Normalize files
      let images = req.files?.images;
  
      if (images && !Array.isArray(images)) {
        images = [images];
      }
  
      const MAX_SIZE = 2 * 1024 * 1024;
      let uploadedImages = [];
      let failedImages = [];
  
      if (images && images.length > 0) {
        // Validate size
        for (const file of images) {
          if (file.size > MAX_SIZE) {
            return res.status(400).json({
              success: false,
              message: "Each image must be less than 2 MB",
            });
          }
        }
  
        // Upload images
        const uploadResults = await Promise.allSettled(
          images.map((file) =>
            uploadImageToCloudinary(file, process.env.REGION_IMAGES).then(
              (uploaded) => ({
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
                size: uploaded.size,
              })
            )
          )
        );
  
        uploadedImages = uploadResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
  
        failedImages = uploadResults
          .map((result, idx) =>
            result.status === "rejected"
              ? { fileName: images[idx].name, error: result.reason.message }
              : null
          )
          .filter(Boolean);
      }
  
      // Ensure at least one source exists
      if (uploadedImages?.length === 0 && parsedImageLinks?.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please upload images or provide image links",
        });
      }
  
      // Save to DB
      const newRegionImages = await RegionImage.create({
        masterRegionId: regionId,
        images: uploadedImages,
        imageLinks: parsedImageLinks,
        updatedBy: req.user?.userId,
      });
  
      return res.status(201).json({
        success: true,
        message: "Region images saved successfully",
        newRegionImages,
        failedImages,
      });
    } catch (error) {
      console.error("Add Region Images Error:", error);
  
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal server error",
      });
    }
};
