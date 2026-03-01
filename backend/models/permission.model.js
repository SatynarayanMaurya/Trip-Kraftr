// const mongoose = require("mongoose");
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    name: {
      type: String,
      required: true,
    },
    permissions: [ { type: String } ],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
  },
  { timestamps: true }
);


permissionSchema.index(
    { org_id: 1, name: 1 },
    { unique: true }
  );
export default mongoose.model("Permission",permissionSchema)