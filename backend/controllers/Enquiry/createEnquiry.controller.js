
import B2BEnquiry from "../../models/Enquiry/B2BEnquiry.model.js"
import B2CEnquiry from "../../models/Enquiry/B2CEnquiry.model.js"



export const addB2BEnquiry = async(req ,res)=>{
    try{
        const {accountId, adult, assignedTo, child, childAges,totalMembers, destinations, dietaryPreference, hotelCategory, noOfDays, notes, startDate, status, tripType} = req.body;

        if(!accountId || !adult || !noOfDays || !destinations){
            return res.status(400).json({
                success:false,
                message:"Required Fields are missing"
            })
        }

        const count = await B2BEnquiry.countDocuments();
        const enquiryId=`ENQ-${count+1}`

        // const findEx
        const newEnquiry = await B2BEnquiry.create(
            {
                org_id:req.user.org_id,
                enquiryId, 
                accountId, 
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
                tripType

            })

        await newEnquiry.populate({path:'accountId',select: "_id businessName phone source"})

        return res.status(201).json({
            success:true,
            message:"Enquiry Created",
            newEnquiry
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message||"Internal Server Error"
        })
    }
}

export const addB2CEnquiry = async(req ,res)=>{
    try{
        const {accountId, adult, assignedTo, child, childAges,totalMembers, destinations, dietaryPreference, hotelCategory, noOfDays, notes, startDate, status, tripType} = req.body;

        if(!accountId || !adult || !noOfDays || !destinations){
            return res.status(400).json({
                success:false,
                message:"Required Fields are missing"
            })
        }

        const count = await B2CEnquiry.countDocuments();
        const enquiryId=`ENQ-${count+1}`

        // const findEx
        const newEnquiry = await B2CEnquiry.create(
            {
                org_id:req.user.org_id,
                enquiryId, 
                accountId, 
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
                tripType

            })

            await newEnquiry.populate({path:'accountId',select: "_id fullName phone source"})

        return res.status(201).json({
            success:true,
            message:"Enquiry Created",
            newEnquiry
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message||"Internal Server Error"
        })
    }
}