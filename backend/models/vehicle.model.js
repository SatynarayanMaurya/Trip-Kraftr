

import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({

    regionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Region",
        required:true
    },

    org_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },
    pricePerDay:{
        type:Number,
        required:true
    },
    capacity:{
        type:Number,
        required:true,
        default:0
    },
    transferPrice:{
        type:Number,
    },
    contactNo:{
        type:Number,
    },
    vehicleImageUrl:{
        type:String,
        default:null
    },
    vehicleModel:{
        type:String,
        default:null
    },
    vehicleModel_lower: {
        type: String,
        required: true
    },
    vehicleType:{
        type:String,
        default:null
    },
    vendorName:{
        type:String,
        default:null
    },
    is_active:{
        type:Boolean,
        default:true
    },

},{ timestamps: true })

vehicleSchema.index(
    { org_id: 1, regionId: 1,vehicleModel_lower:1 },
    { unique: true }
  );

export default mongoose.model("Vehicle", vehicleSchema)