

import mongoose from "mongoose";

const paymentPolicySchema = new mongoose.Schema({

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

paymentPolicySchema.index(
    { org_id: 1, regionId: 1 },
  );

export default mongoose.model("PaymentPolicy", paymentPolicySchema)