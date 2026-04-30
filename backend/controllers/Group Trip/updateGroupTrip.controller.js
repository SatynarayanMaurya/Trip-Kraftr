import GroupTrip from "../../models/groupTrip.model.js"
import GroupTripSummary from "../../models/groupTripSummary.model.js"
import mongoose from "mongoose";


export const updateGroupTripSummaryById = async (req, res) => {
    try {
        const { _id, netProfit, totalHotelCost, totalOtherCost, totalVehicleCost } = req.body;
        const { groupTripId } = req.params;

        // ✅ Validate IDs
        if (!groupTripId || !mongoose.Types.ObjectId.isValid(groupTripId)) {
            return res.status(400).json({
                success: false,
                message: "Valid groupTripId is required",
            });
        }

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                success: false,
                message: "Valid _id is required",
            });
        }

        // ✅ Build dynamic update object (prevents overwriting)
        const updateFields = {};

        if (netProfit !== undefined) updateFields["financialCloseup.netProfit"] = netProfit;
        if (totalHotelCost !== undefined) updateFields["financialCloseup.totalHotelCost"] = totalHotelCost;
        if (totalOtherCost !== undefined) updateFields["financialCloseup.totalOtherCost"] = totalOtherCost;
        if (totalVehicleCost !== undefined) updateFields["financialCloseup.totalVehicleCost"] = totalVehicleCost;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided to update",
            });
        }

        console.log("groupTripId,_id : ",groupTripId, _id)
        // ✅ Update
        const updatedSummary = await GroupTripSummary.findOneAndUpdate(
            {
                org_id: req.user.org_id,
                groupTripId,
                _id
            },
            { $set: updateFields },
            {
                new: true,            // return updated doc
            }
        );

        if (!updatedSummary) {
            return res.status(404).json({
                success: false,
                message: "Group Trip Summary not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Group Trip Summary updated successfully",
            updatedSummary
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};

export const updateGroupTripById = async (req, res) => {
    try {
        const { groupTripId } = req.params;
        if (!groupTripId) {
            return res.status(400).json({
                success: false,
                message: "Group Trip id not found"
            })
        }
        const { itineraryBuilder, regionDetails, tripDetails } = req.body;

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
                .populate({ path: 'regionDetails.region1', select: "_id name" })
                .populate({ path: 'regionDetails.region2', select: "_id name" })
                .populate({ path: 'regionDetails.region3', select: "_id name" })
                .populate({ path: 'itineraryBuilder.daysDetails.placeDetails.placeId', select: "_id placeName" })
                .populate({ path: 'itineraryBuilder.daysDetails.subRegion1', select: "_id name" })
                .populate({ path: 'itineraryBuilder.daysDetails.subRegion2', select: "_id name" })
                .populate({ path: 'itineraryBuilder.daysDetails.subRegion3', select: "_id name" })
                .populate({ path: 'itineraryBuilder.daysDetails.hotelDetails.roomTypeId', select: "_id roomName quantity" })
                .populate({ path: 'itineraryBuilder.daysDetails.hotelDetails.hotelId', select: "_id images amenities googleRating category" })
                .populate({
                    path: 'itineraryBuilder.daysDetails.placeDetails.placeId',
                    select: "_id placeName imageUrl notes subRegionId",
                    populate: {
                      path: 'subRegionId',
                      select: "_id name" 
                    }
                  }),

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

        if (!updatedGroupTrip) {
            return res.status(404).json({
                success: false,
                message: "Group Trip Not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Group Trip Updated Successfully",
            updatedGroupTrip,
            updateGroupTripSummary
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}

export const updateGroupTripStatus = async(req,res)=>{
    try{
        const {status} = req.body;
        const {groupTripId} = req.params;
        if(!status || !groupTripId){
            return res.status(400).json({
                success:false,
                message:"Required field are missing"
            })
        }

        const updatedGroupTrip = await GroupTrip.findOneAndUpdate({org_id:req.user.org_id,_id:groupTripId},{$set:{status}},{new:true})
        if(!updatedGroupTrip){
            return res.status(404).json({
                success:false,
                message:"Group Trip not found",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Group Trip Status Updated",
            updatedGroupTrip
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message||"Internal Server Errror"
        })
    }
}
