import mongoose from "mongoose";

const privateTripSchema = new mongoose.Schema(
    {
        org_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        privateTripId: { type: String, required: true },

        enquiryId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "enquiryModel"
        },

        enquiryType: {
            type: String,
            enum: ["b2b", "b2c"],
            required: true
        },

        enquiryModel: {
            type: String,
            required: true,
            enum: ["B2BEnquiry", "B2CEnquiry"]
        },

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
                        default: null
                    },

                    subRegion2: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "SubRegion",
                    },

                    subRegion3: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "SubRegion",
                    },

                    hotelDetails: {
                        amenities: [{ type: String }],
                        hotelCategory: { type: String },

                        hotelId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Hotel",
                            default: null
                        },

                        hotelName: { type: String },
                        hotelImage: { type: String },
                        hotelType: { type: String },

                        rooms: [
                            {
                                cnbPrice: { type: Number },
                                extraMattressPrice: { type: Number },
                                maxAdults: { type: Number },
                                noOfCnb: { type: Number },
                                noOfExtraMattress: { type: Number },
                                noOfRooms: { type: Number },
                                roomPrice: { type: Number },
                                roomType: { type: String },
                                mealPlan: { type: String },

                                roomTypeId: {
                                    type: mongoose.Schema.Types.ObjectId,
                                    ref: "Room",
                                },
                            }
                        ]
                    },

                    placeDetails: [
                        {
                            placeId: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Place",
                                default: null
                            },
                            isFavourite: { type: Boolean }
                        }
                    ],

                    vehicleDetails: [
                        {
                            vehicleId: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Vehicle",
                                default: null
                            },
                            capacity: { type: Number, },
                            pricePerDay: { type: Number, },
                            quantity: { type: Number, },
                            vehicleImageUrl: { type: String, },
                            vehicleModel: { type: String, },
                            vehicleType: { type: String, },
                        }
                    ],

                    activities: [
                        {
                            activityId: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Activity",
                                default: null
                            },

                            activityName: { type: String },
                            activityType: { type: String },
                            isComplimentary: { type: Boolean },
                            price: { type: Number },
                            quantity: { type: Number },
                        }
                    ]
                }
            ]
        },


        price: {
            showBreakUp: { type: Boolean },
            baseCost: { type: Number },
            min_margin: { type: Number },
            max_margin: { type: Number },
            margin: { type: Number },
            commission: { type: Number },
            isMargin: { type: Boolean },
            additionalActivities: { type: Number },
            totalCost: { type: Number },
            festivalSurge: { type: Number },
            discount: { type: Number },
            isGstChecked: { type: Boolean },
            gstPrice: { type: Number },
            finalPrice: { type: Number },
            discountedPrice: { type: Number },
        },




    },
    { timestamps: true }
);

/**
 * Indexes
 */
privateTripSchema.index({ org_id: 1 });

export default mongoose.model("PrivateTrip", privateTripSchema);