import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
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

    regionName: {
        type: String,
        default: null
    },

    subRegionName: {
        type: String,
        default: null
    },

    subRegionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubRegion"
    },

    placeName: {
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

    mapLink: String,

    imageUrl: String,
    imagePublicId: String

}, { timestamps: true });

// Case-insensitive unique index
placeSchema.index(
    { org_id: 1, regionId: 1, placeName: 1 },
    { unique: true }
);

export default mongoose.model("Place", placeSchema);