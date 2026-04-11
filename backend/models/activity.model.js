import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },

    regionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Region",
        required: true
    },

    subRegionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubRegion"
    },

    activityName: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
    },

    description: String,
    notes: String,

    price: {
        type: Number,
        required: true,
    },

    imageUrl: String,
    imagePublicId: String

}, { timestamps: true });

// Case-insensitive unique index
activitySchema.index(
    { org_id: 1, regionId: 1, activityName: 1 },
    { unique: true }
);

export default mongoose.model("Activity", activitySchema);