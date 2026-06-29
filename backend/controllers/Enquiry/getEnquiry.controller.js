import B2BAccount from "../../models/Accounts/B2BAccounts.model.js";
import B2CAccount from "../../models/Accounts/B2CAccounts.model.js";
import B2BEnquiry from "../../models/Enquiry/B2BEnquiry.model.js"
import B2CEnquiry from "../../models/Enquiry/B2CEnquiry.model.js"
import PrivateTrip from "../../models/Private Trip/privateTrip.model.js"
import mongoose from "mongoose";



export const getB2BEnquiry = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 5, 1)

    const skip = (page - 1) * limit;

    const allB2BEnquiries = await B2BEnquiry
      .find({ org_id: req.user.org_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .select("_id enquiryId name destinations noOfDays assignedTo status accountId isActive")
      .populate({ path: 'accountId', select: "_id phone businessName source" })

    const totalB2BEnquiries = await B2BEnquiry.countDocuments({ org_id: req.user.org_id })
    const totalPages = Math.ceil(totalB2BEnquiries / limit)

    return res.status(200).json({
      success: true,
      message: "All B2B Enquiries fetched successfully",
      allB2BEnquiries,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalRecords: totalB2BEnquiries
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


export const getB2CEnquiry = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 5, 1)

    const skip = (page - 1) * limit;

    const allB2CEnquiries = await B2CEnquiry
      .find({ org_id: req.user.org_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .select("_id enquiryId name destinations noOfDays assignedTo status accountId isActive")
      .populate({ path: 'accountId', select: "_id phone fullName source" })

    const totalB2CEnquiries = await B2CEnquiry.countDocuments({ org_id: req.user.org_id })
    const totalPages = Math.ceil(totalB2CEnquiries / limit)

    return res.status(200).json({
      success: true,
      message: "All B2C Enquiries fetched successfully",
      allB2CEnquiries,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalRecords: totalB2CEnquiries
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


export const getB2BEnquiryById = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    if (!enquiryId) {
      return res.status(400).json({
        success: false,
        message: "Enquiry Id not found"
      })
    }

    const foundEnquiry = await B2BEnquiry.findOne(
      {
        org_id: req.user.org_id,
        _id: enquiryId
      }
    )
      .populate({ path: 'accountId', select: "_id businessName accountId source phone email state" })

    if (!foundEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry Not Found"
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry founded',
      foundEnquiry
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    })
  }
}

export const getB2CEnquiryById = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    if (!enquiryId) {
      return res.status(400).json({
        success: false,
        message: "Enquiry Id not found"
      })
    }

    const foundEnquiry = await B2CEnquiry.findOne(
      {
        org_id: req.user.org_id,
        _id: enquiryId
      }
    )
      .populate({ path: 'accountId', select: "_id fullName accountId source phone email state" })

    if (!foundEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry Not Found"
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry founded',
      foundEnquiry
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    })
  }
}





export const searchB2BEnquiry = async (req, res) => {
  try {
    const { search, filter, region, month, forParticipant } = req.query;

    // Account query
    const accountQuery = {
      org_id: req.user.org_id,
    };

    const trimmed = search?.trim();

    // Search by business name OR phone
    if (trimmed) {
      accountQuery.$or = [
        {
          businessName_lower: {
            $regex: `^${trimmed}`,
            $options: "i",
          },
        },
        {
          phone_str: {
            $regex: `^${trimmed}`,
          },
        },
      ];
    }

    // Find matching accounts
    const matchedAccounts = await B2BAccount.find(
      accountQuery
    ).select("_id");


    const accountIds = matchedAccounts.map(
      (acc) => acc._id
    );

    // If no matching accounts
    if (accountIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Enquiries fetched successfully",
        searchedEnquiries: [],
      });
    }

    // Find enquiries using account ids
    const query = {
      org_id: req.user.org_id,
      accountId: { $in: accountIds },
    };

    // add status filter only if provided
    if (filter) {
      query.status = filter;
    }
    if (month) {
      query.month = month;
    }
    if (region) {
      query.destinations = region;
    }

    if (forParticipant === 'true') {
      query.status = 'New'
    }

    const searchedEnquiries = await B2BEnquiry.find(query)
      .sort({ createdAt: -1 })
      .populate(
        "accountId",
        "businessName email phone source"
      );

    return res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      searchedEnquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.message || "Internal Server Error",
    });
  }
};

export const searchB2CEnquiry = async (req, res) => {
  try {
    const { search, filter, region, month, forParticipant } = req.query;

    // Account query
    const accountQuery = {
      org_id: req.user.org_id,
    };

    const trimmed = search?.trim();

    // Search by business name OR phone
    if (trimmed) {
      accountQuery.$or = [
        {
          fullName_lower: {
            $regex: `^${trimmed}`,
            $options: "i",
          },
        },
        {
          phone_str: {
            $regex: `^${trimmed}`,
          },
        },
      ];
    }


    // Find matching accounts
    const matchedAccounts = await B2CAccount.find(
      accountQuery
    ).select("_id");

    const accountIds = matchedAccounts.map(
      (acc) => acc._id
    );

    // If no matching accounts
    if (accountIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Enquiries fetched successfully",
        searchedEnquiries: [],
      });
    }

    // Find enquiries using account ids
    const query = {
      org_id: req.user.org_id,
      accountId: { $in: accountIds },
    };

    // add status filter only if provided
    if (filter) {
      query.status = filter;
    }
    if (month) {
      query.month = month;
    }
    if (region) {
      query.destinations = region;
    }

    if (forParticipant === 'true') {
      query.status = 'New'
    }

    const searchedEnquiries = await B2CEnquiry.find(query)
      .sort({ createdAt: -1 })
      .populate(
        "accountId",
        "fullName email phone source"
      );

    return res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      searchedEnquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.message || "Internal Server Error",
    });
  }
};


export const getAllGroupTripAndPrivateTripAssociatedWithEnquiryId = async (req, res) => {
  try {
    const { enquiryId } = req.params
    if (!enquiryId) {
      return res.status(400).json({
        success: false,
        message: "Enquiry id not found"
      })
    }

    const privateTrips = await PrivateTrip.find(
      {
        org_id: req.user.org_id,
        enquiryId
      }
    )
      .select({
        _id: 1,
        privateTripId: 1,
        enquiryId: 1,
        enquiryModel: 1,
        purpose:1,
        "regionDetails.region1": 1,
        "regionDetails.region2": 1,
        "regionDetails.region3": 1,
        "regionDetails.startDate": 1,
        "regionDetails.noOfDays": 1,
        'itineraryBuilder.tripName': 1,
        'price.discountedPrice': 1,
      })
      .populate({ path: 'regionDetails.region1', select: "_id name" })
      .populate({ path: 'regionDetails.region2', select: "_id name" })
      .populate({ path: 'regionDetails.region3', select: "_id name" })

    return res.status(200).json({
      success: true,
      message: "All Trip fetched",
      data: privateTrips
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    })
  }
}

export const searchB2BAccountsForEnquiry = async (req, res) => {
  try {
    const { search, pageLimit } = req.query;
    const query = {
      org_id: req.user.org_id,
      isActive: true
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
      .select("_id fullName businessName email phone state destinations source accountId isActive purpose");

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
    const { search, pageLimit } = req.query;
    const query = {
      org_id: req.user.org_id,
      isActive: true
    };

    // 🔍 Search by name OR phone
    const trimmed = search?.trim()
    if (trimmed) {
      query.$or = [
        { fullName_lower: { $regex: `^${trimmed}`, $options: "i" } },
        { phone_str: { $regex: `^${trimmed}` } }
      ];
    }

    const searchedAccounts = await B2CAccount
      .find(query)
      .limit(Number(pageLimit) || 5)
      .select("_id fullName email phone  source accountId state noOfMembers purpose")

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