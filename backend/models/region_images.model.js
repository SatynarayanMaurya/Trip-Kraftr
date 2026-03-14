

import mongoose from "mongoose";

const regionImagesSchema = new mongoose.Schema({
    
    masterRegionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MasterRegion"
    },

    images:[
        {
            url: { type: String, default: null },       // Cloudinary secure URL
            public_id: { type: String, default: null }, // Cloudinary public_id
            size: { type: Number, default: null },  
        }
    ],
    imageLinks:[
        { type: String, default: null },     
    ],

    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

},{ timestamps: true })

export default mongoose.model("RegionImage",regionImagesSchema)