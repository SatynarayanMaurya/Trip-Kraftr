import mongoose from "mongoose";

/**
 * Common Payment Schema
 */
const paymentSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        mode: {
            type: String,
            required: true,
        },

        utrNo: {
            type: String,
            default: "",
        },

        status: {
            type: String,
        },

    },
    { _id: false }
);

/**
 * Hotel Payment Schema
 */
const hotelPaymentSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },

        hotelName: {
            type: String,
            required: true,
        },

        payments: [paymentSchema],
        price:Number
    },
    { _id: false }
);

/**
 * Vehicle Vendor Payment Schema
 */
const vehiclePaymentSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
        },

        payments: [paymentSchema],

        price:Number
    },
    { _id: false }
);

/**
 * Private Trip Finance Schema
 */
const privateTripFinanceSchema = new mongoose.Schema(
    {
        org_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        privateTripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PrivateTrip",
            required: true,
        },

        guestPayments: [paymentSchema],
        hotelPayments: [hotelPaymentSchema],
        vehiclePayments: [vehiclePaymentSchema],
    },
    {
        timestamps: true,
    }
);

/**
 * One finance record per trip
 */
privateTripFinanceSchema.index(
    {
        org_id: 1,
        tripId: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model(
    "PrivateTripFinance",
    privateTripFinanceSchema
);