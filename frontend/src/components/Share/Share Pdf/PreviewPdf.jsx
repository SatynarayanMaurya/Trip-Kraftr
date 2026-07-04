// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { usePrivateTripHooks } from "../../../hooks/usePrivateTripHooks";
// import { useSamplePackageHooks } from "../../../hooks/useSamplePackageHooks";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useRegionHooks } from "../../../hooks/useRegionHooks";
// import PdfDetailsPrivateAndSample from "./PdfDetailsPrivateAndSample";
// import { usePolicyHooks } from "../../../hooks/usePolicyHooks";

// function PreviewPdf() {
//     const { tripId } = useParams();
//     const location = useLocation();
//     const pdfRef = useRef();

//     const { getPrivateTripById } = usePrivateTripHooks();
//     const { getPoliciesForRegion } = usePolicyHooks()
//     const { getSamplePackageById } = useSamplePackageHooks();
//     const { fetchOrgRegionImages } = useRegionHooks()

//     const [regionsImage, setRegionsImages] = useState([])
//     const [policies, setPolicies] = useState(null)

//     const [fetchLoading, setFetchLoading] = useState(false);

//     const isProduction = useSelector((s) => s.user.isProduction);

//     const privateTripDetails = useSelector(
//         (s) => s.privateTrip.privateTripById?.[tripId]
//     );

//     const samplePackageDetails = useSelector(
//         (s) => s.samplePackage.samplePackageById?.[tripId]
//     );

//     const isPrivateTrip = location.pathname.startsWith("/private-trip");
//     const isSamplePackage = location.pathname.startsWith("/sample-package");

//     // Single variable to use everywhere
//     const tripDetails = isPrivateTrip
//         ? privateTripDetails
//         : samplePackageDetails;

//     const fetchTrip = async () => {
//         try {
//             setFetchLoading(true);

//             if (isPrivateTrip) {
//                 await getPrivateTripById(tripId);
//             } else if (isSamplePackage) {
//                 await getSamplePackageById(tripId);
//             }
//         } catch (error) {
//             if (!isProduction) {
//                 console.log("========= ERROR DEBUG START =========");
//                 console.log("Error:", error);
//                 console.log("Response:", error?.response);
//                 console.log("========= ERROR DEBUG END =========");
//             }

//             toast.error(
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Something went wrong"
//             );
//         } finally {
//             setFetchLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (tripId) {
//             fetchTrip();
//         }
//     }, [tripId]);

//     const fetchRegionImages = async () => {
//         try {
//             setFetchLoading(true);
//             if (!tripDetails?.regionDetails?.region1?._id) return
//             const response = await fetchOrgRegionImages(tripDetails?.regionDetails?.region1?._id)
//             setRegionsImages(response?.data?.data)

//         } catch (error) {
//             if (!isProduction) {
//                 console.log("========= ERROR DEBUG START =========");
//                 console.log("Error:", error);
//                 console.log("Response:", error?.response);
//                 console.log("========= ERROR DEBUG END =========");
//             }

//             toast.error(
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Something went wrong"
//             );
//         } finally {
//             setFetchLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (tripDetails) {
//             fetchRegionImages();
//         }
//     }, [tripDetails]);

//     const fetchPolicies = async () => {
//         try {
//             const response = await getPoliciesForRegion(tripDetails?.regionDetails?.region1?._id);
//             setPolicies(response?.data?.data)
//         } catch (error) {
//             if (!isProduction) {
//                 console.log("========= ERROR DEBUG START =========");
//                 console.log("Error:", error);
//                 console.log("Response:", error?.response);
//                 console.log("========= ERROR DEBUG END =========");
//             }
//             toast.error(error?.response?.data?.message || error?.message || "Error fetching policies");
//         }
//     };

//     useEffect(() => {
//         if (tripDetails?.regionDetails?.region1?._id) {
//             fetchPolicies();
//         }
//     }, [tripDetails?.regionDetails?.region1?._id]);


//     return <div className="min-h-screen bg-gray-200 flex justify-center py-8 px-4 overflow-auto">
//         <div  ref={pdfRef} className=" w-full max-w-200  bg-white shadow-2xl rounded-md p-8 ">
//             <PdfDetailsPrivateAndSample tripDetails={tripDetails} regionsImage={regionsImage} tripType={isPrivateTrip ? "privateTrip" : "samplePackage"} policies={policies} />
//         </div>
//     </div>
// }

// export default PreviewPdf;






import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { usePrivateTripHooks } from "../../../hooks/usePrivateTripHooks";
import { useSamplePackageHooks } from "../../../hooks/useSamplePackageHooks";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegionHooks } from "../../../hooks/useRegionHooks";
import PdfDetailsPrivateAndSample from "./PdfDetailsPrivateAndSample";
import { usePolicyHooks } from "../../../hooks/usePolicyHooks";
import { useTripPdfData } from "../../../hooks/useTripPdfData";

function PreviewPdf() {
    const { tripId } = useParams();
    const location = useLocation()
    const isPrivateTrip = location.pathname.startsWith("/private-trip");
    const isSamplePackage = location.pathname.startsWith("/sample-package");
    const tripType = isPrivateTrip ? "privateTrip":'samplePackage'
    const {
        loading,
        tripDetails,
        regionsImage,
        policies,
    } = useTripPdfData({ tripId, tripType: "privateTrip",});

    if (loading) {
        return <div>Loading...</div>;
    }


    return <div className="min-h-screen bg-gray-200 flex justify-center py-8 px-4 overflow-auto">
        <div className=" w-full max-w-200  bg-white shadow-2xl rounded-md p-8 ">
            <PdfDetailsPrivateAndSample tripDetails={tripDetails} regionsImage={regionsImage} tripType={isPrivateTrip ? "privateTrip" : "samplePackage"} policies={policies} />
        </div>
    </div>
}

export default PreviewPdf;