

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({


    org_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },

    hotelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel",
        required:true
    },

    roomName:{
        type:String,
        required:true
    },

    roomName_lower:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },
    capacity:{
        type:Number,
        default:0
    },
    adult:{
        type:Number,
        default:0
    },
    children:{
        type:Number,
        default:0
    },

},{ timestamps: true })

roomSchema.index(
    { org_id: 1, hotelId: 1,roomName_lower:1 },
    { unique: true }
  );

export default mongoose.model("Room", roomSchema)