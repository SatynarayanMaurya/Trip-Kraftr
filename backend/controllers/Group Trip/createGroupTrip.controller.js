import GroupTrip from "../../models/groupTrip.model.js"
import GroupTripSummary from "../../models/groupTripSummary.model.js"
import GroupTripParticipant from '../../models/Group Trip/groupTripParticipants.model.js'
import mongoose from 'mongoose'

export const addGroupTrip = async (req, res) => {
    try {
        const { itineraryBuilder, regionDetails, tripDetails } = req.body;

        const latestPackage = await GroupTrip
            .findOne({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .select("tripId")

        const latestId = latestPackage?.tripId?.split("-")?.[1]
        const tripId = `GRPTRIP-${(Number(latestId) || 0) + 1}`

        const newGroupTrip = await GroupTrip.create({ org_id: req.user.org_id, tripId: tripId, itineraryBuilder, regionDetails, tripDetails })
        const newGroupTripSummary = await GroupTripSummary.create({ org_id: req.user.org_id, groupTripId: newGroupTrip?._id, bookingSummary: { confirmedBookings: 0, availableSeats: tripDetails?.totalSeats, totalSeats: tripDetails?.totalSeats } })
        await newGroupTrip.populate([
            { path: "regionDetails.region1", select: "_id name" },
        ]);
        return res.status(201).json({
            success: true,
            message: "Group Trip Created successfully",
            newGroupTrip,
            newGroupTripSummary
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}


export const addGroupTripParticipant = async (req, res) => {
    try {
        const { contact, dietaryPreference, status, enquiryType, enquiryId, groupTripId, occupancy, paidAmount, saleAmount, totalMembers, travellerName, visaStatus } = req.body;

        if (!enquiryId || !groupTripId || !travellerName || !saleAmount || !contact) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }

        const findExisitingParticipant = await GroupTripParticipant.findOne({ org_id: req.user.org_id, groupTripId, enquiryId })
        if (findExisitingParticipant) {
            return res.status(409).json({
                success: false,
                message: "Participant already exist"
            })
        }
        if (status !== 'enquiry') {

            // 1. Get current document
            const summary = await GroupTripSummary.findOne({
                org_id: req.user.org_id,
                groupTripId
            });

            if (!summary) return;

            const remainingSeats = summary?.bookingSummary?.availableSeats;
            if (remainingSeats < totalMembers) {
                return res.status(409).json({
                    success: false,
                    message: "Available seat less that your total members"
                })
            }

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


        const enquiryModel = enquiryType === 'b2c' ? 'B2CEnquiry' : 'B2BEnquiry';
        const newParticipant = await GroupTripParticipant.create(
            {
                org_id: req.user.org_id,
                groupTripId,
                enquiryId,
                enquiryModel,
                enquiryType,
                contact,
                dietaryPreference,
                occupancy,
                paidAmount,
                saleAmount,
                totalMembers,
                travellerName,
                visaStatus,
                status
            }
        )

        return res.status(201).json({
            success: true,
            message: "Participant Added",
            newParticipant
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}
