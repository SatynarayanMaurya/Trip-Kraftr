

import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },

    max_users:{    // How much user can be use at the same time this is not no. of customer
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

    group_trip:{
        type:Boolean,
        default:false
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