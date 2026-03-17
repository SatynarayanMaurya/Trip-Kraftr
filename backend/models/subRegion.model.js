import mongoose from "mongoose";

const subRegionSchema = new mongoose.Schema({

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
    name:{
        type:String,
        default:null
    },
    description:{
        type:String,
        default:null
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

// compound index
subRegionSchema.index(
    { org_id: 1, name: 1,regionId: 1 },
    { unique: true }
  );

export default mongoose.model("SubRegion",subRegionSchema)