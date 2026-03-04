
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: function() {
            return this.role !== "super_admin";
        }
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        default:null,
    },
    phone:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["super_admin","org_admin","travel_consultant","sales_consultant","customer"],
        default:"customer"
    },
    additionalDetails: {
        id: { type: mongoose.Schema.Types.ObjectId, required: false },
        type: { type: String, enum: ["TravelConsultant", "SalesConsultant"], required: false }
    },
    is_active:{
        type:Boolean,
        default:true
    },
    last_visited:{
        type:Date,
        default:null
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
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

// userSchema.index(
//     { org_id: 1, phone: 1 },
//     {
//       unique: true,
//       partialFilterExpression: { org_id: { $exists: true } }
//     }
//   );
userSchema.index(
    {  phone: 1 },
  );

export default mongoose.model("User",userSchema)