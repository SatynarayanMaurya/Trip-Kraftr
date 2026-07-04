import PrivateTrip from "../../models/Private Trip/privateTrip.model.js"
import PrivateTripFinance from "../../models/Private Trip/privateTripfinances.model.js"
import B2CAccount from "../../models/Accounts/B2CAccounts.model.js"
import B2BAccount from "../../models/Accounts/B2BAccounts.model.js"
import B2CEnquiry from "../../models/Enquiry/B2CEnquiry.model.js"
import B2BEnquiry from "../../models/Enquiry/B2BEnquiry.model.js"

import mongoose from "mongoose"

export const getPrivateTrips = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 5, 1)

    const skip = (page - 1) * limit


    // Fetch regions with pagination
    const allPrivateTrips = await PrivateTrip
      .find({ org_id: req.user.org_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        _id: 1,
        privateTripId: 1,
        enquiryId: 1,
        enquiryModel: 1,
        status: 1,
        "regionDetails.region1": 1,
        "regionDetails.startDate": 1,
        "regionDetails.noOfDays": 1,
        "regionDetails.adults": 1,
        "regionDetails.children": 1,
        'itineraryBuilder.tripName': 1,
        'itineraryBuilder.daysDetails.placeDetails': 1,
        'itineraryBuilder.daysDetails.activities': 1,
        'price.discountedPrice': 1,
      })
      .populate({ path: 'regionDetails.region1', select: "_id name" })
      .populate({
        path: 'enquiryId',
        select: '_id accountId',
        populate: {
          path: 'accountId',
          select: '_id fullName businessName phone email'
        }
      })


    // Counts
    const totalPrivateTrips = await PrivateTrip.countDocuments({ org_id: req.user.org_id })

    const totalPages = Math.ceil(totalPrivateTrips / limit)

    return res.status(200).json({
      success: true,
      message: "All Private Trips fetched successfully",
      allPrivateTrips,

      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalRecords: totalPrivateTrips
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


export const getPrivateTripById = async (req, res) => {
  try {
    const { privateTripId } = req.params;
    if (!privateTripId) {
      return res.status(400).json({
        success: false,
        message: "Id not provided"
      })
    }

    let foundPrivateTripFinance;
    const foundPrivateTrip = await PrivateTrip.findOne(
      {
        _id: privateTripId
      }
    )
      .populate({
        path: 'itineraryBuilder.daysDetails.placeDetails.placeId',
        select: "_id placeName imageUrl notes subRegionId",
        populate: {
          path: 'subRegionId',
          select: "_id name" // choose fields you need
        }
      })
      .populate({
        path: 'itineraryBuilder.daysDetails.activities.activityId',
        select: "_id imageUrl notes",
      })
      .populate({
        path: 'enquiryId',
        select: "_id accountId",
        populate: {
          path: 'accountId',
          select: "_id fullName businessName email phone source" // choose fields you need
        }
      })
      .populate({ path: 'regionDetails.region1', select: "_id name" })
      .populate({ path: 'regionDetails.region2', select: "_id name" })
      .populate({ path: 'regionDetails.region3', select: "_id name" })
      .populate({ path: 'itineraryBuilder.daysDetails.subRegion1', select: "_id name" })
      .populate({ path: 'itineraryBuilder.daysDetails.subRegion2', select: "_id name" })
      .populate({ path: 'itineraryBuilder.daysDetails.subRegion3', select: "_id name" })

    if (foundPrivateTrip ) {
      foundPrivateTripFinance = await PrivateTripFinance.findOne(
        {
          privateTripId: foundPrivateTrip?._id
        }
      )
        .populate({
          path: 'vehiclePayments.vehicleId',
          select: "_id vendorName contactNo vehicleImageUrl"
        })
    }
    if (!foundPrivateTrip) {
      return res.status(404).json({
        success: false,
        message: "Private trip not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Private Trip found",
      foundPrivateTrip,
      foundPrivateTripFinance
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server Error"
    })
  }
}


export const searchPrivateTrips = async (req, res) => {
  try {
    const { search, regionId, daysFilter, statusFilter } = req.query;

    const query = {
      org_id: req.user.org_id
    };
    if (daysFilter) {
      query['regionDetails.noOfDays'] = daysFilter
    }

    if (statusFilter) {
      query.status = statusFilter
    }

    // if (search) {
    //   query["itineraryBuilder.tripName"] = { $regex: `^${search.trim()}`, $options: "i" };
    // }

    const regex = {
      $regex: `^${search.trim()}`,
      $options: "i"
    };
    // Search B2C accounts
    const b2cAccounts = await B2CAccount.find({
      fullName: regex
    }).select("_id");

    // Search B2B accounts
    const b2bAccounts = await B2BAccount.find({
      businessName: regex
    }).select("_id");

    // Get matching B2C enquiries
    const b2cEnquiries = await B2CEnquiry.find({
      accountId: { $in: b2cAccounts.map(a => a._id) }
    }).select("_id");

    // Get matching B2B enquiries
    const b2bEnquiries = await B2BEnquiry.find({
      accountId: { $in: b2bAccounts.map(a => a._id) }
    }).select("_id");

    const enquiryIds = [
      ...b2cEnquiries.map(e => e._id),
      ...b2bEnquiries.map(e => e._id),
    ];

    if (search) {
      query.$or = [
        {
          "itineraryBuilder.tripName": {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          enquiryId: { $in: enquiryIds }
        }
      ];
    }

    if (regionId) {
      const regionObjectId = new mongoose.Types.ObjectId(regionId);

      query.$or = [
        { "regionDetails.region1": regionObjectId },
        { "regionDetails.region2": regionObjectId },
        { "regionDetails.region3": regionObjectId }
      ];
    }

    const searchedPrivateTrips = await PrivateTrip
      .find(query)
      .lean()
      .select({
        _id: 1,
        privateTripId: 1,
        enquiryId: 1,
        enquiryModel: 1,
        status: 1,
        "regionDetails.region1": 1,
        "regionDetails.startDate": 1,
        "regionDetails.noOfDays": 1,
        "regionDetails.adults": 1,
        "regionDetails.children": 1,
        'itineraryBuilder.tripName': 1,
        'itineraryBuilder.daysDetails.placeDetails': 1,
        'itineraryBuilder.daysDetails.activities': 1,
        'price.discountedPrice': 1,
      })
      .populate({ path: 'regionDetails.region1', select: "_id name" })
      .populate({
        path: 'enquiryId',
        select: '_id accountId',
        populate: {
          path: 'accountId',
          select: '_id fullName businessName phone email'
        }
      })

    return res.status(200).json({
      success: true,
      message: "Searched private trips found",
      data: searchedPrivateTrips
    });

  } catch (error) {
    console.log("error : ", error)
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    });
  }
};