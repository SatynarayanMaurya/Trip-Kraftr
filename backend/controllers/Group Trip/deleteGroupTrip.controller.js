
import GroupTrip from "../../models/groupTrip.model.js"
import GroupTripSummary from "../../models/groupTripSummary.model.js"
import mongoose from "mongoose";
import GroupTripParticipant from '../../models/Group Trip/groupTripParticipants.model.js'



export const deleteGroupTripParticipantById = async (req, res) => {
    try {
        const { groupTripId } = req.params;
        if (!groupTripId) {
            return res.status(400).json({
                success: false,
                message: "Group Trip id not found"
            })
        }
        const { _id} = req.body;


        const findParticipant = await GroupTripParticipant.findOne({ org_id: req.user.org_id, groupTripId, _id })
        if (!findParticipant) {
            return res.status(4004).json({
                success: false,
                message: "Participant not found"
            })
        }


        if (findParticipant?.status !== 'enquiry') {

            // 1. Get current document
            const summary = await GroupTripSummary.findOne({
                org_id: req.user.org_id,
                groupTripId
            });

            if (!summary) return;

            const updatedConfirmedBookings = (summary.bookingSummary?.confirmedBookings || 0) - findParticipant?.totalMembers;
            const availableSeats = (summary.bookingSummary?.availableSeats || 0) + findParticipant?.totalMembers;
            const updatedPotentialRevenue = (summary.paymentSummary?.potentialRevenue || 0) - findParticipant?.saleAmount;

            const updatedTotalPaid = (summary.paymentSummary?.totalPaid || 0)  - findParticipant?.paidAmount;

            const updatedTotalRevenue = (summary.financialOverview?.totalRevenue || 0)  - findParticipant?.saleAmount;

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
                        "bookingSummary.availableSeats": availableSeats,
                        "paymentSummary.potentialRevenue": updatedPotentialRevenue,
                        "paymentSummary.totalPaid": updatedTotalPaid,
                        "paymentSummary.totalBalance": updatedTotalBalance,

                        "financialOverview.totalRevenue": updatedTotalRevenue,
                        "financialOverview.totalProfitLoss": updatedProfitLoss
                    }
                }
            );
        }

        const deletedParticipant = await GroupTripParticipant.findOneAndDelete(
            {
                org_id: req.user.org_id,
                groupTripId,
                _id
            },
        )

        return res.status(200).json({
            success: true,
            message: "Participant Deleted ",
            deletedParticipant
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}


export const deleteGroupTrip = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { groupTripId } = req.params;

        if (!groupTripId) {
            return res.status(400).json({
                success: false,
                message: "Group Trip Id is required",
            });
        }

        session.startTransaction();

        // Delete the group trip
        const deletedGroupTrip = await GroupTrip.findOneAndDelete(
            {
                _id: groupTripId,
                org_id: req.user.org_id,
            },
            { session }
        );

        if (!deletedGroupTrip) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "Group Trip not found",
            });
        }

        // Delete all participants
        await GroupTripParticipant.deleteMany(
            {
                org_id: req.user.org_id,
                groupTripId,
            },
            { session }
        );

        // Delete trip summary
        await GroupTripSummary.deleteOne(
            {
                org_id: req.user.org_id,
                groupTripId,
            },
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Group Trip deleted successfully",
            data:deletedGroupTrip
        });
    } catch (error) {
        await session.abortTransaction();

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    } finally {
        session.endSession();
    }
};
