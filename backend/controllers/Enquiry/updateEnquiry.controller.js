
import B2BEnquiry from "../../models/Enquiry/B2BEnquiry.model.js"
import B2CEnquiry from "../../models/Enquiry/B2CEnquiry.model.js"



export const updateB2BEnquiryById = async(req ,res)=>{
    try{
        const { adult, assignedTo, child, childAges,totalMembers, destinations, dietaryPreference, hotelCategory, noOfDays, notes, startDate, status, tripType, month, purpose} = req.body;

        const {enquiryId} = req.params
        if(!enquiryId){
            return res.status(400).json({
                success:false,
                message:"Enquiry Id not found"
            })
        }

        if( !adult || !noOfDays || !destinations){
            return res.status(400).json({
                success:false,
                message:"Required Fields are missing"
            })
        }

        // const findEx
        const updatedEnquiry = await B2BEnquiry.findOneAndUpdate(
            {
                org_id:req.user.org_id,
                _id:enquiryId
            },
            {
                $set:
                {
                    adult, 
                    assignedTo, 
                    child, 
                    childAges, 
                    destinations, 
                    dietaryPreference, 
                    hotelCategory,
                    totalMembers, 
                    noOfDays, 
                    notes, 
                    startDate, 
                    status, 
                    tripType,
                    month,
                    purpose
                }
            }
        )

        if(!updatedEnquiry){
            return res.status(404).json({
                success:false,
                message:"Enquiry not found"
            })
        }


        return res.status(200).json({
            success:true,
            message:"Enquiry Updated",
            updatedEnquiry
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message||"Internal Server Error"
        })
    }
}


export const updateB2CEnquiryById = async(req ,res)=>{
    try{
        const { adult, assignedTo, child, childAges,totalMembers, destinations, dietaryPreference, hotelCategory, noOfDays, notes, startDate, status, tripType, month, purpose} = req.body;

        const {enquiryId} = req.params
        if(!enquiryId){
            return res.status(400).json({
                success:false,
                message:"Enquiry Id not found"
            })
        }

        if( !adult || !noOfDays || !destinations){
            return res.status(400).json({
                success:false,
                message:"Required Fields are missing"
            })
        }

        // const findEx
        const updatedEnquiry = await B2CEnquiry.findOneAndUpdate(
            {
                org_id:req.user.org_id,
                _id:enquiryId
            },
            {
                $set:
                {
                    adult, 
                    assignedTo, 
                    child, 
                    childAges, 
                    destinations, 
                    dietaryPreference, 
                    hotelCategory,
                    totalMembers, 
                    noOfDays, 
                    notes, 
                    startDate, 
                    status, 
                    tripType,
                    month,
                    purpose
                }
            }
        )

        if(!updatedEnquiry){
            return res.status(404).json({
                success:false,
                message:"Enquiry not found"
            })
        }


        return res.status(200).json({
            success:true,
            message:"Enquiry Updated",
            updatedEnquiry
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message||"Internal Server Error"
        })
    }
}
