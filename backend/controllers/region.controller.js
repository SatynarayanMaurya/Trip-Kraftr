

import Region from "../models/region.model.js"


export const addRegion = async(req,res)=>{
    try{
        const {name,description,country, min_margin,max_margin} = req.body

        const org_id = req.user.org_id;

        if(!name || !country || !min_margin || !max_margin){
            return res.status(400).json({
                success:false,
                message:"Required fields are missing"
            })
        }

        if(!org_id){
            return res.status(400).json({
                success:false,
                message:"Organization id not found"
            })
        }
        if(Number(min_margin) > Number(max_margin)){
            return res.status(400).json({
                success:false,
                message:"Min margin cannot be greater than max margin"
            })
        }

        const existingRegion = await Region.findOne({org_id,name})
        if(existingRegion){
            return res.status(409).json({
                success:false,
                message:"Region already exist"
            })
        }

        const newRegion = await Region.create({name,org_id,description,country, min_margin:Number(min_margin),max_margin:Number(max_margin),updatedBy:req.user.userId})
        return res.status(201).json({
            success:true,
            message:"Region added successfully",
            newRegion
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server error"
        })
    }
}