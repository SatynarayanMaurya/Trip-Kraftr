import GroupTrip from "../models/groupTrip.model.js"


export const addGroupTrip = async(req ,res)=>{
    try{
        // const

        return res.status(201).json({
            success:true,
            message:"Group Trip Created successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}