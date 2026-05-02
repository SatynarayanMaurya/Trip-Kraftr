import GroupTrip from "../../models/groupTrip.model.js"
import GroupTripSummary from "../../models/groupTripSummary.model.js"
import mongoose from "mongoose";


export const getGroupTrips = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 5, 1)

    const skip = (page - 1) * limit


    // Fetch regions with pagination
    const allGroupTrips = await GroupTrip
      .find({ org_id: req.user.org_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .select({
        _id: 1,
        tripId: 1,
        "regionDetails.region1": 1,
        "regionDetails.fromDate": 1,
        "regionDetails.toDate": 1,
        status: 1,
        'tripDetails.totalSeats': 1
      })
      .populate({ path: 'regionDetails.region1', select: "_id name" })


    // Counts
    const totalGroupTrips = await GroupTrip.countDocuments({ org_id: req.user.org_id })

    const totalPages = Math.ceil(totalGroupTrips / limit)

    return res.status(200).json({
      success: true,
      message: "All Group Trips fetched successfully",
      allGroupTrips,

      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalRecords: totalGroupTrips
      },
      stats: {
        totalGroupTrips,
      }
    })

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    })
  }
}


export const getGroupTripById = async (req, res) => {
  try {
    const { groupTripId } = req.params;

    if (!groupTripId) {
      return res.status(400).json({
        success: false,
        message: "Group Trip Id not found"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(groupTripId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Group Trip Id format"
      });
    }

    const [findGroupTrip, findGroupTripSummary] = await Promise.all([
      GroupTrip.findOne({
        org_id: req.user.org_id,
        _id: groupTripId,
      })
        .populate({
          path: 'itineraryBuilder.daysDetails.placeDetails.placeId',
          select: "_id placeName imageUrl notes subRegionId",
          populate: {
            path: 'subRegionId',
            select: "_id name" // choose fields you need
          }
        })
        .populate({ path: 'regionDetails.region1', select: "_id name" })
        .populate({ path: 'itineraryBuilder.daysDetails.hotelDetails.hotelId', select: "_id images amenities googleRating category" })
        .populate({ path: 'itineraryBuilder.daysDetails.hotelDetails.roomTypeId', select: "_id roomName quantity" })
        .populate({ path: 'itineraryBuilder.daysDetails.subRegion1', select: "_id name" })
        .populate({ path: 'itineraryBuilder.daysDetails.subRegion2', select: "_id name" })
        .populate({ path: 'itineraryBuilder.daysDetails.subRegion3', select: "_id name" }),
      GroupTripSummary?.findOne({
        org_id: req.user.org_id,
        groupTripId,
      }).select("_id bookingSummary financialOverview paymentSummary financialCloseup")
    ]);

    if (!findGroupTrip) {
      return res.status(404).json({
        success: false,
        message: "Group Trip not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group trip found",
      findGroupTrip,
      findGroupTripSummary
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    });
  }
};

// Suggestion Group Trip while adding the group trip
export const suggestionGroupTrip = async (req, res) => {
  try {
    const { region1, region2, region3, noOfDays } = req.query;

    if (!region1 || !noOfDays) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }


    const isValidObjectId = (id) => {
      return mongoose.Types.ObjectId.isValid(id);
    };
    const matchCondition = {
      org_id: new mongoose.Types.ObjectId(req.user.org_id),

      "regionDetails.region1": isValidObjectId(region1) ? new mongoose.Types.ObjectId(region1) : null,

      "regionDetails.region2": isValidObjectId(region2) ? new mongoose.Types.ObjectId(region2) : null,

      "regionDetails.region3": isValidObjectId(region3) ? new mongoose.Types.ObjectId(region3) : null,
      "regionDetails.noOfDays": Number(noOfDays),
      status: { $in: ["completed", "confirmed"] },
    };


    // Priority order for status
    const statusPriority = {
      completed: 1,
      confirmed: 2,
      inProgress: 3,
      created: 4,
      cancelled: 5, // lowest priority (optional)
    };

    const trips = await GroupTrip.aggregate([
      {
        $match: matchCondition,
      },
      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "completed"] }, then: 1 },
                { case: { $eq: ["$status", "confirmed"] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
      {
        $sort: { statusPriority: 1, createdAt: -1 }, // latest + priority
      },
      {
        $limit: 4,
      },
      {
        $project: {
          tripId: 1,
          itineraryBuilder: 1,
          status: 1,
          createdAt: 1,
          _id: 1
        }
      }
    ]);

    // const trips = await GroupTrip.find(matchCondition)

    return res.status(200).json({
      success: true,
      trips,
      message:
        trips.length > 0
          ? "Suggested group trips found"
          : "No matching group trips found, proceed manually",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

// Search Hotels for org
export const searchGroupTrip = async (req, res) => {
  try {
    const { search, regionId, pageLimit } = req.query;

    const query = {
      org_id: req.user.org_id
    };

    if (search) {
      query.tripId = { $regex: `${search.trim()}`, $options: "i" };
    }

    if (regionId) {
      const regionObjectId = new mongoose.Types.ObjectId(regionId);

      query.$or = [
        { "regionDetails.region1": regionObjectId },
        { "regionDetails.region2": regionObjectId },
        { "regionDetails.region3": regionObjectId }
      ];
    }

    const searchedGroupTrips = await GroupTrip
      .find(query)
      .limit(pageLimit || 5)
      .lean()
      .select({
        _id: 1,
        tripId: 1,
        "regionDetails.region1": 1,
        "regionDetails.fromDate": 1,
        "regionDetails.toDate": 1,
        status: 1,
        "tripDetails.totalSeats": 1
      })
      .populate({
        path: "regionDetails.region1",
        select: "_id name"
      });

    return res.status(200).json({
      success: true,
      message: "Searched GroupTrip found",
      searchedGroupTrips
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error"
    });
  }
};