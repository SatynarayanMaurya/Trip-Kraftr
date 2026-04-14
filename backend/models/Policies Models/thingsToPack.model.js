

import mongoose from "mongoose";

const thingsToPackSchema = new mongoose.Schema({

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

    policyCategory: {
        type: String,
        required: true
    },

    policies: [{
        type: String,
    }],



}, { timestamps: true })

thingsToPackSchema.index(
    { org_id: 1, regionId: 1 },
  );

export default mongoose.model("ThingsToPack", thingsToPackSchema)