import SamplePackage from "../../models/samplePackage.model.js"



export const createSamplePackage = async (req, res) => {
    try {
        const { regionDetails, itineraryBuilder, vendorDetails, price } = req.body;

        if (!regionDetails || !itineraryBuilder || !vendorDetails || !price) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }
        const latestPackage = await SamplePackage
            .findOne({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .select("samplePackageName")

        const latestId = latestPackage?.samplePackageName?.split("-")?.[1]
        const samplePackageName = `SAMPKG-${(Number(latestId)||0) + 1}`

        const newSamplePackage = await SamplePackage.create({
            org_id: req.user.org_id,
            samplePackageName,
            regionDetails,
            itineraryBuilder,
            vendorDetails,
            price
        });

        await newSamplePackage.populate({
            path: 'regionDetails.region1',
            select: '_id name'
        });

        return res.status(201).json({
            success: true,
            message: "New Sample Package Created",
            newSamplePackage
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}