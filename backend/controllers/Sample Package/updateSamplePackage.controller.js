import SamplePackage from "../../models/samplePackage.model.js"



export const updateSamplePackageById = async (req, res) => {
    try {
        const { regionDetails, itineraryBuilder, vendorDetails, price } = req.body;
        const { samplePackageId } = req.params;

        if (!samplePackageId) {
            return res.status(400).json({
                success: false,
                message: "Id not found"
            })
        }

        if (!regionDetails || !itineraryBuilder || !vendorDetails || !price) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }


        const updatedSamplePackage = await SamplePackage.findOneAndUpdate(
            {
                org_id: req.user.org_id,
                _id: samplePackageId
            },
            {
                $set:
                {
                    regionDetails,
                    itineraryBuilder,
                    vendorDetails,
                    price
                }
            },
            { new: true }
        )
            .populate({
                path: 'regionDetails.region1',
                select: '_id name'
            })
            .populate({
                path: 'itineraryBuilder.daysDetails.placeDetails.placeId',
                select: "_id placeName imageUrl notes subRegionId",
                populate: {
                    path: 'subRegionId',
                    select: "_id name" // choose fields you need
                }
            })
            .populate({ path: 'regionDetails.region1', select: "_id name" })
            .populate({ path: 'regionDetails.region2', select: "_id name" })
            .populate({ path: 'regionDetails.region3', select: "_id name" })
            .populate({ path: 'itineraryBuilder.daysDetails.subRegion1', select: "_id name" })
            .populate({ path: 'itineraryBuilder.daysDetails.subRegion2', select: "_id name" })
            .populate({ path: 'itineraryBuilder.daysDetails.subRegion3', select: "_id name" })


        return res.status(200).json({
            success: true,
            message: "Sample Package Updated",
            updatedSamplePackage
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}