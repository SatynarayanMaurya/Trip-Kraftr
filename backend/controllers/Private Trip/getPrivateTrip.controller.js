import PrivateTrip from "../../models/Private Trip/privateTrip.model.js"

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
      .lean()
      .select({
        _id: 1,
        privateTripId: 1,
        "regionDetails.region1": 1,
        "regionDetails.startDate": 1,
        "regionDetails.noOfDays": 1,
        "regionDetails.adults": 1,
        "regionDetails.children": 1,
        'itineraryBuilder.tripName': 1
      })
      .populate({ path: 'regionDetails.region1', select: "_id name" })


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


export const getSamplePackageById = async (req, res) => {
  try {
    const { samplePackageId } = req.params;
    if (!samplePackageId) {
      return res.status(400).json({
        success: false,
        message: "Id not provided"
      })
    }


    const foundSamplePackage = await SamplePackage.findOne(
      {
        org_id: req.user.org_id,
        _id: samplePackageId
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
      .populate({ path: 'regionDetails.region1', select: "_id name" })
      .populate({ path: 'regionDetails.region2', select: "_id name" })
      .populate({ path: 'regionDetails.region3', select: "_id name" })
      .populate({ path: 'itineraryBuilder.daysDetails.subRegion1', select: "_id name" })
      .populate({ path: 'itineraryBuilder.daysDetails.subRegion2', select: "_id name" })
      .populate({ path: 'itineraryBuilder.daysDetails.subRegion3', select: "_id name" })

    if (!foundSamplePackage) {
      return res.status(404).json({
        success: false,
        message: "Sample Package not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Sample package found",
      foundSamplePackage
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server Error"
    })
  }
}


export const searchSamplePackage = async (req, res) => {
  try {
    const { search, regionId, days, pageLimit } = req.query;

    const query = {
      org_id: req.user.org_id
    };

    if(days){
      query['regionDetails.noOfDays'] = days
    }

    if (search) {
      query["itineraryBuilder.tripName"] = { $regex: `^${search.trim()}`, $options: "i" };
    }

    if (regionId) {
      const regionObjectId = new mongoose.Types.ObjectId(regionId);

      query.$or = [
        { "regionDetails.region1": regionObjectId },
        { "regionDetails.region2": regionObjectId },
        { "regionDetails.region3": regionObjectId }
      ];
    }

    const searchedSamplePackage = await SamplePackage
      .find(query)
      .limit(pageLimit || 5)
      .lean()
      .select({
        _id: 1,
        samplePackageName: 1,
        "regionDetails.region1": 1,
        "regionDetails.startDate": 1,
        "regionDetails.noOfDays": 1,
        "regionDetails.adults": 1,
        "regionDetails.children": 1,
        'itineraryBuilder.tripName': 1
      })
      .populate({ path: 'regionDetails.region1', select: "_id name" })

    return res.status(200).json({
      success: true,
      message: "Searched sample package found",
      searchedSamplePackage
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    });
  }
};