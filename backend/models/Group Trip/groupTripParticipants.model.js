import mongoose from "mongoose";

const groupTripParticipantsSchema = new mongoose.Schema({

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

    enquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "enquiryModel"
    },

    enquiryType: {
        type: String,
        enum: ["b2b", "b2c"],
        required: true
    },

    enquiryModel: {
        type: String,
        required: true,
        enum: ["B2BEnquiry", "B2CEnquiry"]
    },

    contact: {
        type: Number,
        required: true
    },

    dietaryPreference: {
        type: String,
    },

    occupancy: {
        type: String,
    },

    travellerName: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    visaStatus: {
        type: String,
    },

    saleAmount: {
        type: Number,
        required: true
    },

    paidAmount: {
        type: Number,
        required: true
    },

    totalMembers: {
        type: Number,
        required: true
    },

}, { timestamps: true });

groupTripParticipantsSchema.index(
    { org_id: 1, groupTripId: 1 }
);

export default mongoose.model(
    "GroupTripParticipant",
    groupTripParticipantsSchema
);