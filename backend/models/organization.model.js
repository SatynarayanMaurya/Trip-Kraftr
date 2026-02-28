

import mongoose from "mongoose";

const organizatonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    planId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Plan",
        required:true
    },
    email:{
        type:String,
        default:null
    },
    gst:{
        type:String,
        default:null
    },
    address:{
        type:String,
        default:null
    },
    logo: {
        url: { type: String, default: null },       // Cloudinary secure URL
        public_id: { type: String, default: null }, // Cloudinary public_id
        size: { type: Number, default: null },      // optional: in bytes
    },
    primaryPhone:{
        type:Number,
        required:true
    },
    secondaryPhone:{
        type:Number,
    },
    is_active:{
        type:Boolean,
        default:true
    },
    subscriptionStartDate: {
        type: Date,
        default: Date.now()
    },
    subscriptionEndDate: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setDate(now.getDate() + 30); // add 30 days
            return now;
          }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
})

export default mongoose.model("Organization", organizatonSchema)