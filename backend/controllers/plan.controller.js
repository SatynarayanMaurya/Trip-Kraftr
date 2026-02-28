
import Plan from "../models/plan.model.js"


export const createPlan = async(req ,res)=>{
    try{
        const {name,max_users,max_departure, max_templates,ai_credits_monthly,price_monthly,price_yearly,has_ai_builder,b2b_trip,has_hotel_management,has_vehicle_management,private_trip,group_trip} = req.body;


        const existingPlan = await Plan.findOne({name})
        if(existingPlan){
            return res.status(409).json({
                success:false,
                message:'This plan already exists. Please update the existing plan instead.'
            })
        }

        const newPlan = await Plan.create({name,max_users,max_departure, max_templates,ai_credits_monthly,price_monthly,price_yearly,has_ai_builder,b2b_trip,has_hotel_management,has_vehicle_management,private_trip,group_trip,updatedBy:req.user.userId})



        return res.status(201).json({
            success:true,
            message:'Plan created successfully',
            newPlan
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
