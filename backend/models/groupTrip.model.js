

import mongoose from "mongoose";

const groupTripSchema = new mongoose.Schema({

    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },

    tripId:{
        type:String,
        required:true
    },

    regionDetails:{
        region1:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Region",
            required:true
        },
        region2:{ type:mongoose.Schema.Types.ObjectId, ref:"Region",default:null},
        region3:{ type:mongoose.Schema.Types.ObjectId, ref:"Region",default:null},
        fromDate:{ type:Date, required:true },
        toDate:{ type:Date, required:true },
        noOfDays:{ type:Number, required:true }
    },
    tripDetails:{
        assignedTo:{ type:String, required:true },
        minSeats:Number,
        totalSeats:{ type:Number, required:true },
        occupancy: {
            single: { type: Number, required: true },
            double: Number,
            triple: Number
        },
        selectedVehicleId:{type:mongoose.Schema.Types.ObjectId,ref:"Vehicle"},
        quantity:{type:Number,required:true}  // Vehicle quantity
    },

    itineraryBuilder:{
        tripOverview:String,
        daysDetails:[
            {
                dayOverview:String,
                subRegion1:{type:mongoose.Schema.Types.ObjectId,ref:"SubRegion",default:null},
                subRegion2:{type:mongoose.Schema.Types.ObjectId,ref:"SubRegion",default:null},
                subRegion3:{type:mongoose.Schema.Types.ObjectId,ref:"SubRegion",default:null},
                hotelDetails:{
                    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:"Hotel",default:null},
                    hotelName:{type:String},
                    hotelType:{type:String,enum:['inventory',"manual"]},
                    meals:{type:String},
                    roomType:{type:String},
                    roomTypeId:{type:mongoose.Schema.Types.ObjectId,ref:"Room",default:null},
                },
                activities:[{
                    activityId:{type:mongoose.Schema.Types.ObjectId,ref:"Activity",default:null},
                    activityName:{type:String},
                    activityType:{type:String,enum:['inventory',"manual"]},
                    isComplimentary:{type:Boolean,},
                    price:{type:Number},
                }],
                placeDetails:[{
                    placeId:{type:mongoose.Schema.Types.ObjectId,ref:"Place"},
                    isFavourite:{type:Boolean,},
                }],
            }
        ]
    },

    status:{type:String,default:"new"},


}, { timestamps: true })

groupTripSchema.index(
    { org_id: 1 },
  );

export default mongoose.model("GroupTrip", groupTripSchema)