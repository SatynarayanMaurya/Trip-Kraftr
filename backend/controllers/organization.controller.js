import { uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";
import Organization from "../models/organization.model.js"
import Plan from "../models/plan.model.js"

export const addOrganization = async(req, res)=>{
    try{
        const {name,email,plan,address,gst,primaryPhone,secondaryPhone,subscriptionStartDate,subscriptionEndDate} = req.body;
        const logoFile = req.files?.logo;

        const sizeInMB = (logoFile?.size / (1024 * 1024)).toFixed(2);

        if(sizeInMB > 5){
            return res.status(413).json({
                success:false,
                message:"File size exceeds the maximum allowed limit of 5 MB."
            })
        }

        const conditions = [];

        if (primaryPhone) conditions.push({ primaryPhone });
        if (secondaryPhone) conditions.push({ secondaryPhone });
        if (email) conditions.push({ email });

        // const existingOrganization = await Organization.findOne({$or: conditions});
        const existingOrganization = await Organization.exists({
            $or: conditions
        });

        if(existingOrganization){
            return res.status(409).json({
                success:false,
                message:"Organization with the provided details already exists."
            })
        }

        let logoInfo = null;
        if (logoFile) {
          logoInfo = await uploadImageToCloudinary(
            logoFile,
            process.env.ORGANIZATION_LOGO
          );
        }

        const selectedPlan = await Plan.findOne({ name:plan }).select('_id');
        if(!selectedPlan){
            return res.status(404).json({
                success:false,
                message:"Selected Plan does not exist"
            })
        }

        const organizationData = {
            name,                
            planId: selectedPlan?._id,     
            primaryPhone,      
          
            ...(email && { email }),
            ...(gst && { gst }),
            ...(address && { address }),
            ...(secondaryPhone && { secondaryPhone }),
            ...(subscriptionStartDate && {
                subscriptionStartDate: new Date(subscriptionStartDate)
            }),

            ...(subscriptionEndDate && {
                subscriptionEndDate: new Date(subscriptionEndDate)
            }),
          
            ...(logoInfo && {
              logo: {
                url: logoInfo.secure_url,
                public_id: logoInfo.public_id,
                size: logoInfo.size || null
              }
            })
          };

        const newOrganization = await Organization.create(organizationData) 
        return res.status(201).json({
            success:true,
            message:"Organization created successfully.",
            newOrganization
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message||"Internal server error"
        })
    }
}

export const getAllOrganizationForSuperAdmin = async (req, res)=>{
    try{
        const allOrganizations = await Organization.find()
        .populate({
            path: 'planId', 
            select: 'name'   
        });
        return res.status(200).json({
            success:true,
            message:"All organization fetched",
            allOrganizations
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal server error"
        })
    }
}