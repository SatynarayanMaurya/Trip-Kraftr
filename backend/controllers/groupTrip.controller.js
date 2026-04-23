import GroupTrip from "../models/groupTrip.model.js"
import GroupTripSummary from "../models/groupTripSummary.model.js"
import mongoose from "mongoose";

export const addGroupTrip = async(req ,res)=>{
    try{
        const {itineraryBuilder, regionDetails, tripDetails} = req.body;

        const totalGroupTrip = await GroupTrip.countDocuments({org_id:req.user.org_id})
        const tripId=`GRP-${totalGroupTrip+1}`;
        const newGroupTrip = await GroupTrip.create({org_id:req.user.org_id,tripId:tripId,itineraryBuilder,regionDetails,tripDetails})
        const newGroupTripSummary = await GroupTripSummary.create({org_id:req.user.org_id,groupTripId:newGroupTrip?._id,bookingSummary:{confirmedBookings:0,availableSeats:tripDetails?.totalSeats,totalSeats:tripDetails?.totalSeats}})
        await newGroupTrip.populate([
            { path: "regionDetails.region1", select: "_id name" },
        ]);
        return res.status(201).json({
            success:true,
            message:"Group Trip Created successfully",
            newGroupTrip,
            newGroupTripSummary
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}


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
                tripId:1,
                "regionDetails.region1": 1,
                "regionDetails.fromDate": 1,
                "regionDetails.toDate": 1,
                status:1,
                'tripDetails.totalSeats':1
            })
            .populate({path:'regionDetails.region1',select:"_id name"})
            

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
            .populate({path:'itineraryBuilder.daysDetails.placeDetails.placeId',select:"_id placeName"})
            .populate({path:'itineraryBuilder.daysDetails.subRegion1',select:"_id name"})
            .populate({path:'itineraryBuilder.daysDetails.subRegion2',select:"_id name"})
            .populate({path:'itineraryBuilder.daysDetails.subRegion3',select:"_id name"}),
            GroupTripSummary?.findOne({
                org_id: req.user.org_id,
                groupTripId,
            }).select("_id bookingSummary financialOverview paymentSummary")
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

export const updateGroupTripById = async(req,res)=>{
    try{
        const {groupTripId} = req.params;
        if(!groupTripId){
            return res.status(400).json({
                success:false,
                message:"Group Trip id not found"
            })
        }
        const {itineraryBuilder, regionDetails, tripDetails} = req.body;

        const [updatedGroupTrip, updateGroupTripSummary] = await Promise.all([
            GroupTrip.findOneAndUpdate(
              {
                org_id: req.user.org_id,
                _id: groupTripId
              },
              {
                $set: { itineraryBuilder, regionDetails, tripDetails }
              },
              { new: true }
            )
              .populate({ path: 'itineraryBuilder.daysDetails.placeDetails.placeId', select: "_id placeName" })
              .populate({ path: 'itineraryBuilder.daysDetails.subRegion1', select: "_id name" })
              .populate({ path: 'itineraryBuilder.daysDetails.subRegion2', select: "_id name" })
              .populate({ path: 'itineraryBuilder.daysDetails.subRegion3', select: "_id name" }),
          
            GroupTripSummary.findOneAndUpdate(
              {
                org_id: req.user.org_id,
                groupTripId: groupTripId
              },
              {
                $set: {
                  bookingSummary: { totalSeats: tripDetails?.totalSeats }
                }
              },
              { new: true }
            )
          ]);

        if(!updatedGroupTrip){
            return res.status(404).json({
                success:false,
                message:"Group Trip Not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Group Trip Updated Successfully",
            updatedGroupTrip,
            updateGroupTripSummary
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}

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