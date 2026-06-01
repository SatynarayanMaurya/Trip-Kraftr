import mongoose from "mongoose";

const samplePackageSchema = new mongoose.Schema(
    {
        org_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        samplePackageName: { type: String, required: true },

        regionDetails: {
            region1: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Region",
                required: true,
            },

            region2: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Region",
            },

            region3: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Region",
            },

            noOfDays: { type: Number, required: true },
            adults: { type: Number, required: true },
            children: { type: Number },

            childAges: [{ type: Number }],

            startDate: { type: Date, required: true }
        },

        itineraryBuilder: {
            tripName: { type: String, required: true },
            tripOverview: { type: String },
            daysDetails: [
                {
                    dayOverview: { type: String },
                    subRegion1: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "SubRegion",
                        default:null
                    },

                    subRegion2: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "SubRegion",
                    },

                    subRegion3: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "SubRegion",
                    },

                    hotelDetails:{
                        amenities:[{type:String}],
                        hotelCategory:{type:String},

                        hotelId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Hotel",
                            default:null
                        },

                        hotelName:{type:String},
                        hotelImage:{type:String},
                        hotelType:{type:String},

                        rooms:[
                            {
                                cnbPrice:{type:Number}, 
                                extraMattressPrice:{type:Number}, 
                                maxAdults:{type:Number}, 
                                noOfCnb:{type:Number}, 
                                noOfExtraMattress:{type:Number}, 
                                noOfRooms:{type:Number}, 
                                roomPrice:{type:Number}, 
                                roomType:{type:String}, 
                                mealPlan:{type:String}, 

                                roomTypeId: {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: "Room",
                                },
                            }
                        ]
                    },

                    placeDetails:[
                        {
                            placeId: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Place",
                                default:null
                            },
                            isFavourite:{type:Boolean}
                        }
                    ],

                    vehicleDetails:[
                        {
                            vehicleId: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Vehicle",
                                default:null
                            },
                            capacity: { type: Number, },
                            pricePerDay: { type: Number, },
                            quantity: { type: Number, },
                            vehicleImageUrl: { type: String, },
                            vehicleModel: { type: String, },
                            vehicleType: { type: String, },
                        }
                    ],

                    activities:[
                        {
                            activityId: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Activity",
                                default:null
                            },

                            activityName: { type: String},
                            activityType: { type: String},
                            isComplimentary: { type: Boolean},
                            price: { type: Number},
                            quantity: { type: Number},
                        }
                    ]
                }
            ]
        },

        vendorDetails:{
            vendorName: { type: String},
            vendorPrice: { type: Number},
            commission: { type: Number},
        },

        price:{
            totalPrice: { type: Number},
            additionalPrice: { type: Number},
            gstPercent: { type: Number},
            gstPrice: { type: Number},
            isGstChecked: { type: Boolean},
            finalPrice: { type: Number},
        },
 



    },
    { timestamps: true }
);

/**
 * Indexes
 */
samplePackageSchema.index({ org_id: 1 });

export default mongoose.model("SamplePackage", samplePackageSchema);