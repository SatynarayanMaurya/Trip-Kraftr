
import Plan from "../models/plan.model.js"


export const createPlan = async(req ,res)=>{
    try{
        const {name,max_users,max_departure, max_templates,ai_credits_monthly,price_monthly,price_yearly,has_ai_builder,b2b_trip,has_hotel_management,has_vehicle_management,private_trip} = req.body;


        console.log(name,max_users,max_departure, max_templates,ai_credits_monthly,price_monthly,price_yearly,has_ai_builder,b2b_trip,has_hotel_management,has_vehicle_management,private_trip)

        return res.status(201).json({
            success:true,
            message:'Plan created successfully'
        })
    }
    catch(error){
        console.log("Error in creating the plan : ",error)
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server error"
        })
    }
}
