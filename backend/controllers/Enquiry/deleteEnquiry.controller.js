

import B2BEnquiry from "../../models/Enquiry/B2BEnquiry.model.js"
import B2CEnquiry from "../../models/Enquiry/B2CEnquiry.model.js"



export const deleteB2BEnquiryById = async(req , res)=>{
    try{
        const {enquiryId} = req.params;
        if(!enquiryId){
            return res.status(400).json({
                success:false,
                message:"Enquiry id not found"
            })
        }

        const deletedEnquiruy = await B2BEnquiry.findOneAndDelete({org_id:req.user.org_id,_id:enquiryId})
        if(!deletedEnquiruy){
            return res.status(404).json({
                success:false,
                message:"Enquiry not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Enquiry Deleted",
            deletedEnquiruy
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}


export const deleteB2CEnquiryById = async(req , res)=>{
    try{
        const {enquiryId} = req.params;
        if(!enquiryId){
            return res.status(400).json({
                success:false,
                message:"Enquiry id not found"
            })
        }

        const deletedEnquiruy = await B2CEnquiry.findOneAndDelete({org_id:req.user.org_id,_id:enquiryId})
        if(!deletedEnquiruy){
            return res.status(404).json({
                success:false,
                message:"Enquiry not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Enquiry Deleted",
            deletedEnquiruy
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}