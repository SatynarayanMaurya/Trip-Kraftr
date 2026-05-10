import B2BAccount from "../../models/Accounts/B2BAccounts.model.js";
import B2CAccount from "../../models/Accounts/B2CAccounts.model.js";
import mongoose from "mongoose";



export const searchB2BAccountsForEnquiry = async (req, res) => {
    try {
        const { search, pageLimit } = req.query;
        const query = {
            org_id: req.user.org_id,
            isActive:true
        };

        // 🔍 Search by name OR phone
        const trimmed = search?.trim()
        if (trimmed) {

            query.$or = [
                { businessName_lower: { $regex: `^${trimmed}`, $options: "i" } },
                { phone_str: { $regex: `^${trimmed}` } }
            ];
        }

        const searchedAccounts = await B2BAccount
            .find(query)
            .limit(Number(pageLimit) || 5)
            .select("_id fullName businessName email phone destinations source accountId isActive");

        return res.status(200).json({
            success: true,
            message: "Accounts fetched successfully",
            searchedAccounts
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};


export const searchB2CAccountsForEnquiry = async (req, res) => {
    try {
      const { search,  pageLimit } = req.query;
      const query = {
        org_id: req.user.org_id,
        isActive:true
      };
  
      // 🔍 Search by name OR phone
      const trimmed = search?.trim()
      if(trimmed){
          query.$or = [
              { fullName_lower: { $regex: `^${trimmed}`, $options: "i" } },
              { phone_str: { $regex: `^${trimmed}` } }
            ];
        }
  
      const searchedAccounts = await B2CAccount
        .find(query)
        .limit(Number(pageLimit) || 5)
        .select("_id fullName email phone  source accountId noOfMembers")
  
      return res.status(200).json({
        success: true,
        message: "Accounts fetched successfully",
        searchedAccounts
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal Server Error"
      });
    }
};