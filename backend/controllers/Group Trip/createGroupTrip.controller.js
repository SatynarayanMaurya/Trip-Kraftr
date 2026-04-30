import GroupTrip from "../../models/groupTrip.model.js"
import GroupTripSummary from "../../models/groupTripSummary.model.js"

export const addGroupTrip = async (req, res) => {
    try {
        const { itineraryBuilder, regionDetails, tripDetails } = req.body;

        const totalGroupTrip = await GroupTrip.countDocuments({ org_id: req.user.org_id })
        const tripId = `GRP-${totalGroupTrip + 1}`;
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
