import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    org_id:{   
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },

    country:{
        type:String,
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
regionSchema.index({ org_id: 1, name: 1 })

export default mongoose.model("Region",regionSchema)