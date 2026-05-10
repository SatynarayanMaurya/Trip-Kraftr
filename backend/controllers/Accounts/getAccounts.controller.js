
import B2BAccount from "../../models/Accounts/B2BAccounts.model.js";
import B2CAccount from "../../models/Accounts/B2CAccounts.model.js";
import mongoose from "mongoose";

export const getB2BAccounts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit;

        const allB2BAccounts = await B2BAccount
            .find({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .select("_id businessName email phone source accountId isActive")

        const totalB2BAccounts = await B2BAccount.countDocuments({ org_id: req.user.org_id })
        const totalPages = Math.ceil(totalB2BAccounts / limit)

        return res.status(200).json({
            success: true,
            message: "All B2B accounts fetched successfully",
            allB2BAccounts,
            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalB2BAccounts
            },
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}


export const getB2CAccounts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)

        const skip = (page - 1) * limit;

        const allB2CAccounts = await B2CAccount
            .find({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .select("_id fullName email phone destinations source accountId isActive")

        const totalB2CAccounts = await B2CAccount.countDocuments({ org_id: req.user.org_id })
        const totalPages = Math.ceil(totalB2CAccounts / limit)


        return res.status(200).json({
            success: true,
            message: "All B2C accounts fetched successfully",
            allB2CAccounts,
            pagination: {
                currentPage: page,
                totalPages,
                limit,
                totalRecords: totalB2CAccounts
            },
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}


export const getB2BAccountById = async (req, res) => {
    try {
        const { accountId } = req.params;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "Account Id not found"
            })
        }
        // Validate hotelId as a proper MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Account ID"
            });
        }

        // Fetch the hotel (org_id is already validated in middleware)
        const foundAccount = await B2BAccount
            .findOne({ org_id: req.user.org_id, _id: accountId })
            .select("_id accountId businessName email gstNo isActive phone secondaryPhone source referralBy state address")

        if (!foundAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Account found",
            foundAccount
        });

    } catch (error) {
        console.error("Error fetching hotel:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};


export const getB2CAccountById = async (req, res) => {
    try {
        const { accountId } = req.params;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "Account Id not found"
            })
        }
        // Validate hotelId as a proper MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Account ID"
            });
        }


        // Fetch the hotel (org_id is already validated in middleware)
        const foundAccount = await B2CAccount
            .findOne({ org_id: req.user.org_id, _id: accountId })
            .select("_id accountId fullName email isActive phone source referralBy state assignedTo destinations dietaryPreference month noOfMembers tripType")

        if (!foundAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Account found",
            foundAccount
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        });
    }
};



export const searchB2BAccounts = async (req, res) => {
    try {
      const { search, filter, pageLimit } = req.query;
      const query = {
        org_id: req.user.org_id
      };
  
      // 🔍 Search by name OR phone
      const trimmed = search?.trim()
      if(trimmed){

          query.$or = [
              { businessName_lower: { $regex: `^${trimmed}`, $options: "i" } },
              { phone_str: { $regex: `^${trimmed}` } }
            ];
        }
      if (filter) {
        query.source = filter;
      }
  
      const searchedAccounts = await B2BAccount
        .find(query)
        // .limit(Number(pageLimit) || 5)
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

export const searchB2CAccounts = async (req, res) => {
    try {
      const { search, filter, pageLimit } = req.query;
      const query = {
        org_id: req.user.org_id
      };
  
      // 🔍 Search by name OR phone
      const trimmed = search?.trim()
      if(trimmed){
          query.$or = [
              { fullName_lower: { $regex: `^${trimmed}`, $options: "i" } },
              { phone_str: { $regex: `^${trimmed}` } }
            ];
        }
      if (filter) {
        query.source = filter;
      }
  
      const searchedAccounts = await B2CAccount
        .find(query)
        // .limit(Number(pageLimit) || 5)
        .select("_id fullName email phone destinations source accountId isActive")
  
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