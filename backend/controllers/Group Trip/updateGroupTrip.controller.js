import GroupTrip from "../../models/groupTrip.model.js"
import GroupTripSummary from "../../models/groupTripSummary.model.js"
import mongoose from "mongoose";
import GroupTripParticipant from '../../models/Group Trip/groupTripParticipants.model.js'

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
        if (totalHotelCost !== undefined) updateFields["financialOverview.totalCost"] = totalHotelCost + totalOtherCost + totalVehicleCost;
        if (totalOtherCost !== undefined) updateFields["financialCloseup.totalOtherCost"] = totalOtherCost;
        if (totalVehicleCost !== undefined) updateFields["financialCloseup.totalVehicleCost"] = totalVehicleCost;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided to update",
            });
        }

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

        const prevSummary = await GroupTripSummary.findOne({
            org_id: req.user.org_id,
            groupTripId
        }).lean();

        const confirmedBookings = prevSummary?.bookingSummary?.confirmedBookings || 0;

        const bookingSummary = {
            totalSeats: tripDetails.totalSeats,
            confirmedBookings,
            availableSeats: Math.max(0, tripDetails.totalSeats - confirmedBookings)
        };

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
                    groupTripId
                },
                {
                    $set: { bookingSummary }
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

export const updateGroupTripStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { groupTripId } = req.params;
        if (!status || !groupTripId) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }

        const updatedGroupTrip = await GroupTrip.findOneAndUpdate({ org_id: req.user.org_id, _id: groupTripId }, { $set: { status } }, { new: true })
        if (!updatedGroupTrip) {
            return res.status(404).json({
                success: false,
                message: "Group Trip not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Group Trip Status Updated",
            updatedGroupTrip
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Errror"
        })
    }
}


export const updateGroupTripParticipantById = async (req, res) => {
    try {
        const { groupTripId } = req.params;
        if (!groupTripId) {
            return res.status(400).json({
                success: false,
                message: "Group Trip id not found"
            })
        }
        const { _id, contact, dietaryPreference, status, enquiryType, enquiryId, occupancy, paidAmount, saleAmount, totalMembers, travellerName, visaStatus } = req.body;


        if (!enquiryId || !groupTripId || !travellerName || !saleAmount || !contact) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }

        const findParticipant = await GroupTripParticipant.findOne({ org_id: req.user.org_id, groupTripId, _id })
        if (!findParticipant) {
            return res.status(4004).json({
                success: false,
                message: "Participant not found"
            })
        }

        // 1. Get current document
        const summary = await GroupTripSummary.findOne({
            org_id: req.user.org_id,
            groupTripId
        });

        if (!summary) return;

        const remainingSeats = summary?.bookingSummary?.availableSeats - (findParticipant?.status !=='enquiry' ?findParticipant?.totalMembers:0)
        if(remainingSeats < totalMembers){
            return res.status(409).json({
                success:false,
                message:"Available seat less that your total members"
            })
        }


        if (status !== 'enquiry' && findParticipant?.status !== 'enquiry') {


            // 2. Calculate new values safely
            const updatedConfirmedBookings = (summary.bookingSummary?.confirmedBookings || 0) - findParticipant?.totalMembers + Number(totalMembers);

            const updatedAvailableSeats = (summary.bookingSummary?.availableSeats || 0) + findParticipant?.totalMembers - Number(totalMembers);

            const updatedPotentialRevenue = (summary.paymentSummary?.potentialRevenue || 0) + Number(saleAmount) - findParticipant?.saleAmount;

            const updatedTotalPaid = (summary.paymentSummary?.totalPaid || 0) + Number(paidAmount) - findParticipant?.paidAmount;

            const updatedTotalRevenue = (summary.financialOverview?.totalRevenue || 0) + Number(saleAmount) - findParticipant?.saleAmount;

            const updatedTotalBalance = updatedPotentialRevenue - updatedTotalPaid;

            const updatedProfitLoss = updatedTotalRevenue - (summary.financialOverview?.totalCost || 0);

            // 3. Save back
            await GroupTripSummary.updateOne(
                {
                    org_id: req.user.org_id,
                    groupTripId
                },
                {
                    $set: {
                        "bookingSummary.confirmedBookings": updatedConfirmedBookings,
                        "bookingSummary.availableSeats": updatedAvailableSeats,
                        "paymentSummary.potentialRevenue": updatedPotentialRevenue,
                        "paymentSummary.totalPaid": updatedTotalPaid,
                        "paymentSummary.totalBalance": updatedTotalBalance,

                        "financialOverview.totalRevenue": updatedTotalRevenue,
                        "financialOverview.totalProfitLoss": updatedProfitLoss
                    }
                }
            );
        }
        else if (status !== 'enquiry' && findParticipant?.status === 'enquiry') {


            // 2. Calculate new values safely
            const updatedConfirmedBookings = (summary.bookingSummary?.confirmedBookings || 0) + Number(totalMembers);

            const updatedAvailableSeats = (summary.bookingSummary?.availableSeats || 0) - Number(totalMembers);

            const updatedPotentialRevenue = (summary.paymentSummary?.potentialRevenue || 0) + Number(saleAmount);

            const updatedTotalPaid = (summary.paymentSummary?.totalPaid || 0) + Number(paidAmount);

            const updatedTotalRevenue = (summary.financialOverview?.totalRevenue || 0) + Number(saleAmount);

            const updatedTotalBalance = updatedPotentialRevenue - updatedTotalPaid;

            const updatedProfitLoss = updatedTotalRevenue - (summary.financialOverview?.totalCost || 0);

            // 3. Save back
            await GroupTripSummary.updateOne(
                {
                    org_id: req.user.org_id,
                    groupTripId
                },
                {
                    $set: {
                        "bookingSummary.confirmedBookings": updatedConfirmedBookings,
                        "bookingSummary.availableSeats": updatedAvailableSeats,

                        "paymentSummary.potentialRevenue": updatedPotentialRevenue,
                        "paymentSummary.totalPaid": updatedTotalPaid,
                        "paymentSummary.totalBalance": updatedTotalBalance,

                        "financialOverview.totalRevenue": updatedTotalRevenue,
                        "financialOverview.totalProfitLoss": updatedProfitLoss
                    }
                }
            );
        }
        else if (status === 'enquiry' && findParticipant?.status !== 'enquiry') {

            // 2. Calculate new values safely
            const updatedConfirmedBookings = (summary.bookingSummary?.confirmedBookings || 0) - Number(totalMembers);

            const updatedAvailableSeats = (summary.bookingSummary?.availableSeats || 0) + Number(totalMembers);

            const updatedPotentialRevenue = (summary.paymentSummary?.potentialRevenue || 0) - Number(findParticipant?.saleAmount);

            const updatedTotalPaid = (summary.paymentSummary?.totalPaid || 0) - Number(findParticipant?.paidAmount);

            const updatedTotalRevenue = (summary.financialOverview?.totalRevenue || 0) - Number(findParticipant?.saleAmount);

            const updatedTotalBalance = updatedPotentialRevenue - updatedTotalPaid;

            const updatedProfitLoss = updatedTotalRevenue - (summary.financialOverview?.totalCost || 0);

            // 3. Save back
            await GroupTripSummary.updateOne(
                {
                    org_id: req.user.org_id,
                    groupTripId
                },
                {
                    $set: {
                        "bookingSummary.confirmedBookings": updatedConfirmedBookings,
                        "bookingSummary.availableSeats": updatedAvailableSeats,

                        "paymentSummary.potentialRevenue": updatedPotentialRevenue,
                        "paymentSummary.totalPaid": updatedTotalPaid,
                        "paymentSummary.totalBalance": updatedTotalBalance,

                        "financialOverview.totalRevenue": updatedTotalRevenue,
                        "financialOverview.totalProfitLoss": updatedProfitLoss
                    }
                }
            );
        }

        const updatedParticipant = await GroupTripParticipant.findOneAndUpdate(
            {
                org_id: req.user.org_id,
                groupTripId,
                _id
            },
            {
                $set: {
                    contact,
                    dietaryPreference,
                    status,
                    occupancy,
                    paidAmount,
                    saleAmount,
                    totalMembers,
                    travellerName,
                    visaStatus
                }
            }, { new: true }
        )

        return res.status(200).json({
            success: false,
            message: "Participant updated ",
            updatedParticipant
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}
