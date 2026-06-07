import PrivateTrip from "../../models/Private Trip/privateTrip.model.js"



export const createPrivateTrip = async (req, res) => {
    try {
        const { regionDetails, itineraryBuilder, price,enquiryDetails,enquiryType } = req.body;

        if (!regionDetails || !itineraryBuilder || !enquiryDetails || !price) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }
        const latestPackage = await PrivateTrip
            .findOne({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .select("privateTripId")

        const latestId = latestPackage?.privateTripId?.split("-")?.[1]
        const privateTripId = `PRTRIP-${(Number(latestId)||0) + 1}`

        const enquiryModel = enquiryType === 'b2c' ? 'B2CEnquiry' :'B2BEnquiry';
        const newPrivateTrip = await PrivateTrip.create({
            org_id: req.user.org_id,
            privateTripId,
            regionDetails,
            itineraryBuilder,
            price,
            enquiryType:enquiryType,
            enquiryModel,
            enquiryId:enquiryDetails?._id
        });

        // await newSamplePackage.populate({
        //     path: 'regionDetails.region1',
        //     select: '_id name'
        // });

        return res.status(201).json({
            success: true,
            message: "New Private trip Created",
            newPrivateTrip
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}