import mongoose from "mongoose";

const masterRegionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    country:{
        type:String,
        required:true
    },
    
    is_active:{
        type:Boolean,
        default:true
    },
   
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
},{ timestamps: true })


export default mongoose.model("MasterRegion",masterRegionSchema)