
import B2BAccount from "../../models/Accounts/B2BAccounts.model.js";
import B2CAccount from "../../models/Accounts/B2CAccounts.model.js";
import mongoose from "mongoose";


export const updateB2BAccount = async (req, res) => {
    try {
        const { businessName, gstNo, email, source, referralBy, secondaryPhone, phone,whatsappNo, state ,address,} = req.body;
        const {accountId} = req.params;
        if (!businessName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }

        const updatedAccount = await B2BAccount.findOneAndUpdate({org_id:req.user?.org_id,_id:accountId},{$set:{
            businessName: businessName?.trim(),
            gstNo,
            email,
            source,
            referralBy,
            secondaryPhone,
            phone,
            whatsappNo,
            state,address

        }},{new:true})

        return res.status(201).json({
            success: true,
            message: "Account Details Updated",
            updatedAccount
        })
    }
    catch(error){
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: `Business with this name already exists in your organization.`
            });
        }
        return res.status(500).json({
            success:false,
            message:error?.message || 'Internal Server Error'
        })
    }
}


export const updateB2CAccount = async (req, res) => {
    try {
        const { fullName, email, source, referralby, phone,whatsappNo, state, month, dietaryPreference, noOfMembers, destinations, tripType, assignedTo,gstNo } = req.body;
        const {accountId} = req.params;
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }



        const updatedAccount = await B2CAccount.findOneAndUpdate({org_id:req.user.org_id,_id:accountId},{$set:{
            fullName: fullName?.trim(),
            email,
            source,
            referralBy:referralby,
            phone,
            whatsappNo,
            state,
            month,
            dietaryPreference,
            noOfMembers,
            destinations,
            tripType,
            assignedTo,
            gstNo
        }},{new:true})

        return res.status(201).json({
            success: true,
            message: "Account Details Updated",
            updatedAccount
        })
    }
    catch(error){
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: `Business with this name already exists in your organization.`
            });
        }
        return res.status(500).json({
            success:false,
            message:error?.message || 'Internal Server Error'
        })
    }
}


export const updateB2BStatus = async(req,res)=>{
    try{
        const {val} = req.body;
        const {accountId} = req.params
        const updatedAccountStatus = await B2BAccount.findOneAndUpdate(
            {
                org_id:req.user.org_id,
                _id:accountId
            },
            {
                $set:{
                    isActive:val
                }
            },{new:true}
        )

        if(!updatedAccountStatus){
            return res.status(404).json({
                success:false,
                message:"Account Not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:'Account Status Updated',
            updatedAccountStatus
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}


export const updateB2CStatus = async(req,res)=>{
    try{
        const {val} = req.body;
        const {accountId} = req.params
        const updatedAccountStatus = await B2CAccount.findOneAndUpdate(
            {
                org_id:req.user.org_id,
                _id:accountId
            },
            {
                $set:{
                    isActive:val
                }
            },{new:true}
        )

        return res.status(200).json({
            success:true,
            message:'Account Status Updated',
            updatedAccountStatus
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}