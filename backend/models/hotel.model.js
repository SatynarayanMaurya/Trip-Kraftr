

import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({

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
        ref: "SubRegion",
    },

    hotelName: {
        type: String,
        required: true
    },

    hotelName_lower: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: ['Budget', 'Premium', 'Luxury']
    },

    email: {
        type: String,
        default: null
    },

    address: {
        type: String,
        default: null
    },

    contact: {
        type: Number,
        required: true
    },

    googleRating: {
        type: Number,
        default: 0
    },
    amenities: [{
        type: String,
    }],

    images:[
        {
            url: { type: String, default: null },       // Cloudinary secure URL
            public_id: { type: String, default: null }, // Cloudinary public_id
            size: { type: Number, default: null },  
        }
    ],

    is_active: {
        type: Boolean,
        default: true
    },
    checkIn: {
        type: String,
        default: null
    },
    checkOut: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: null
    },
    paymentDetails: {
        type: String,
        default: null
    },


}, { timestamps: true })

hotelSchema.index(
    { org_id: 1, regionId: 1,hotelName_lower:1 },
    { unique: true }
  );

export default mongoose.model("Hotel", hotelSchema)