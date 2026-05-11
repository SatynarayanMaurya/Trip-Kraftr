import mongoose from "mongoose";

const B2BEnquirySchema = new mongoose.Schema({
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    enquiryId:{
        type:String,
        required:true
    },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "B2BAccount",
        required: true
    },

    adult: {
        type: Number,
        required: true
    },

    totalMembers: {
        type: Number,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    child: {
        type: Number,
        default: 0
    },

    childAges: [{
        type: Number,
        default: 0
    }],

    noOfDays: {
        type: Number,
        default: 0
    },


    destinations: [{
        type: String,
    }],

    assignedTo: {
        type: String,
        default: null
    },

    dietaryPreference: {
        type: String,
        default: null
    },

    hotelCategory: {
        type: String,
        default: null
    },

    notes: {
        type: String,
        default: null
    },

    status: {
        type: String,
        default: null
    },

    tripType: {
        type: String,
        default: null
    },

}, { timestamps: true });

// Case-insensitive unique index
B2BEnquirySchema.index(
    { org_id: 1, accountId:1 },
);

export default mongoose.model("B2BEnquiry", B2BEnquirySchema);