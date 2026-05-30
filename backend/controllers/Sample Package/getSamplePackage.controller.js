import SamplePackage from "../../models/samplePackage.model.js"


export const getSamplePackages = async(req, res)=>{
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 5, 1)
    
        const skip = (page - 1) * limit
    
    
        // Fetch regions with pagination
        const allSamplePackages = await SamplePackage
          .find({ org_id: req.user.org_id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .select({
            _id: 1,
            samplePackageName: 1,
            "regionDetails.region1": 1,
            "regionDetails.startDate": 1,
            "regionDetails.noOfDays": 1,
            "regionDetails.adults": 1,
            "regionDetails.children": 1,
            'itineraryBuilder.tripName': 1
          })
          .populate({ path: 'regionDetails.region1', select: "_id name" })
    
    
        // Counts
        const totalSamplePackages = await SamplePackage.countDocuments({ org_id: req.user.org_id })
    
        const totalPages = Math.ceil(totalSamplePackages / limit)
    
        return res.status(200).json({
          success: true,
          message: "All Sample packages fetched successfully",
          allSamplePackages,
    
          pagination: {
            currentPage: page,
            totalPages,
            limit,
            totalRecords: totalSamplePackages
          },
        })
    
      }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}