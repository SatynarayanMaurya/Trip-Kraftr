import mongoose from "mongoose";


/**
 * Reusable Meal Plan Fields (NOT a schema)
 */
const mealPlanFields = {
  ep: { type: Number, default: 0, min: 0 },
  cp: { type: Number, default: 0, min: 0 },
  map: { type: Number, default: 0, min: 0 },
  ap: { type: Number, default: 0, min: 0 },
};

const roomRateSchema = new mongoose.Schema(
  {
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    ratePlanName: {
      type: String,
      required: true,
      trim: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.fromDate <= value;
        },
        message: "toDate must be >= fromDate",
      },
    },

    roomRates: [
      {
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
          required: true,
        },

        roomNameSnapshot: {
          type: String,
          default: null,
        },

        ...mealPlanFields, // ✅ reuse here
      },
    ],

    extraMattress: {
      ...mealPlanFields, // ✅ reuse
      default: {},
    },

    cnb: {
      ...mealPlanFields, // ✅ reuse
      default: {},
    },

  },
  { timestamps: true }
);

/**
 * Indexes
 */
roomRateSchema.index({ org_id: 1, hotelId: 1 });

export default mongoose.model("RoomRate", roomRateSchema);