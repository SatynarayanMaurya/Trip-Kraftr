import mongoose from "mongoose";

const b2cAccountSchema = new mongoose.Schema(
  {
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    accountId: {
      type: String,
      required: true
    },

    fullName: {
      type: String,
      required: true
    },

    fullName_lower: {
      type: String
    },

    email: {
      type: String,
      required: true
    },

    month: {
      type: String,
      default: null
    },

    dietaryPreference: {
      type: String,
      default: null
    },

    referralBy: {
      type: String,
      default: null
    },

    source: {
      type: String,
      required: true
    },

    phone: {
      type: Number,
      required: true,
      unique:true
    },

    phone_str: {
      type: String
    },

    noOfMembers: {
      type: Number
    },

    destinations: [
      {
        type: String
      }
    ],

    state: {
      type: String,
      default: null
    },

    tripType: {
      type: String,
      required: true
    },

    assignedTo: {
      type: String
    },

    gstNo: {
      type: String,
      default:null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


b2cAccountSchema.index({ org_id: 1, fullName_lower: 1,phone_str:1 },{unique:true});


b2cAccountSchema.pre("save", function () {
    // fullName normalization
    if (this.fullName) {
      this.fullName_lower = this.fullName.toLowerCase();
    }
  
    // phone string conversion
    if (this.phone) {
      this.phone_str = this.phone.toString();
    }
  });


  b2cAccountSchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate() || {};
  
    if (update.fullName) {
      update.fullName_lower = update.fullName.toLowerCase();
    }
  
    if (update.phone) {
      update.phone_str = update.phone.toString();
    }
  
    this.setUpdate(update);
  });


  export default mongoose.model("B2CAccount", b2cAccountSchema);