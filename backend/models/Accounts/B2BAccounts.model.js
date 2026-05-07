import mongoose from "mongoose";

const b2bAccountSchema = new mongoose.Schema(
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

    businessName: {
      type: String,
      required: true
    },

    businessName_lower: {
      type: String
    },

    email: {
      type: String,
      required: true
    },

    gstNo: {
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
    },
    
    phone_str: {
      type: String,
      unique:true
    },

    secondaryPhone: {
      type: Number,
      default: null
    },

    state: {
      type: String,
      default: null
    },

    address: {
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


b2bAccountSchema.index(
    { org_id: 1, businessName_lower: 1,phone_str:1 },
    { unique: true }
  );


  b2bAccountSchema.pre("save", function () {
    if (this.businessName) {
      this.businessName_lower = this.businessName.toLowerCase();
    }
  
    if (this.phone) {
      this.phone_str = this.phone.toString();
    }
  });

  b2bAccountSchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate() || {};
  
    if (update.businessName) {
      update.businessName_lower = update.businessName.toLowerCase();
    }
  
    if (update.phone) {
      update.phone_str = update.phone.toString();
    }
  
    this.setUpdate(update);
  });


  export default mongoose.model("B2BAccount", b2bAccountSchema);