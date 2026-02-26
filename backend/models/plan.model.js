

import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },

    max_users:{
        type:Number,
        default:0
    },

    max_departure:{
        type:Number,
        default:0
    },

    max_templates:{
        type:Number,
        default:0
    },

    ai_credits_monthly:{
        type:Number,
        default:0
    },
    
    price_monthly:{
        type:Number,
        default:0
    },
    price_yearly:{
        type:Number,
        default:0
    },
        
    has_ai_builder:{
        type:Boolean,
        default:false
    },

    b2b_trip:{
        type:Boolean,
        default:false
    },

    has_hotel_management:{
        type:Boolean,
        default:false
    },

    has_vehicle_management:{
        type:Boolean,
        default:false
    },

    private_trip:{
        type:Boolean,
        default:false
    },
   
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
})

export default mongoose.model("Plan",planSchema)