

import B2BAccount from "../../models/Accounts/B2BAccounts.model.js";
import B2CAccount from "../../models/Accounts/B2CAccounts.model.js";


export const addB2BAccount = async (req, res) => {
    try {
        const { businessName, gstNo, email, source, referralBy, secondaryPhone, phone, state ,address} = req.body;
        if (!businessName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }
        const existingAccount = await B2BAccount.findOne({org_id:req.user.org_id,phone})
        if(existingAccount){
            return res.status(409).json({
                success:false,
                message:"Account Already exist"
            })
        }

        const counts = await B2BAccount.countDocuments({ org_id: req.user.org_id })
        const accountId = `ACC-${counts + 1}`

        const newAccount = await B2BAccount.create({
            org_id: req.user.org_id,
            accountId,
            // businessName_lower: businessName?.trim()?.toLowerCase(),
            businessName: businessName?.trim(),
            gstNo,
            email,
            source,
            referralBy,
            secondaryPhone,
            phone,
            state,address

        })

        return res.status(201).json({
            success: true,
            message: "New B2B Account Created",
            newAccount
        })
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: `Business with this name already exists in your organization.`
            });
        }

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
}


export const addB2CAccount = async (req, res) => {
    try {
        const { fullName, email, source, referralby, phone, state, month, dietaryPreference, noOfMembers, destinations, tripType, assignedTo, gstNo} = req.body;
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }

        const existingAccount = await B2CAccount.findOne({org_id:req.user.org_id,phone})
        if(existingAccount){
            return res.status(409).json({
                success:false,
                message:"Account Already exist"
            })
        }

        const counts = await B2CAccount.countDocuments({ org_id: req.user.org_id })
        const accountId = `ACC-${counts + 1}`

        const newAccount = await B2CAccount.create({
            org_id: req.user.org_id,
            fullName: fullName?.trim(),
            email,
            accountId,
            source,
            referralBy:referralby,
            phone,
            state,
            month,
            dietaryPreference,
            noOfMembers,
            destinations,
            tripType,
            assignedTo,
            gstNo

        })

        return res.status(201).json({
            success: true,
            message: "New B2C Account Created",
            newAccount
        })
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: `Account with this name already exists in your organization.`
            });
        }
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
}

