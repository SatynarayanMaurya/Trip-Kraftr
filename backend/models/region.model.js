import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({

    masterRegionId:{   
        type:mongoose.Schema.Types.ObjectId,
        ref:"MasterRegion",
        required:true
    },

    org_id:{   
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },


    description:{
        type:String,
        default:null
    },

    min_margin:{
        type:Number,
        default:0
    },

    max_margin:{
        type:Number,
        default:0
    },
    region_images: [{
        type: String
    }],
    
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
regionSchema.index({ org_id: 1,masterRegionId:1 })

export default mongoose.model("Region",regionSchema)