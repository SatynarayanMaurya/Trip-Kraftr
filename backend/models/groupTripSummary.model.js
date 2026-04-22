

import mongoose from "mongoose";

const groupTripSummarySchema = new mongoose.Schema({

    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },

    groupTripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupTrip",
        required: true
    },

    bookingSummary:{
        confirmedBookings:{type:Number,default:0},
        availableSeats:{type:Number,default:0},
        totalSeats:{type:Number,default:0},
    },
    financialOverview:{
        totalRevenue:{type:Number,default:0},
        totalCost:{type:Number,default:0},
        totalPaid:{type:Number,default:0},
    },
    paymentSummary:{
        totalPaid:{type:Number,default:0},
        totalBalance:{type:Number,default:0},
        potentialRevenue:{type:Number,default:0},
    },


}, { timestamps: true })

groupTripSummarySchema.index(
    { org_id: 1, groupTripId: 1},
  );

export default mongoose.model("GroupTripSummary", groupTripSummarySchema)