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
import PdfDetailsGroupTrip from "./PdfDetailsGroupTrip";

function PreviewPdf() {
    const { tripId } = useParams();
    const location = useLocation()
    const isPrivateTrip = location.pathname.startsWith("/private-trip");
    const isSamplePackage = location.pathname.startsWith("/sample-package");
    const isGroupTrip = location.pathname.startsWith("/group-trip");
    // const tripType = isPrivateTrip ? "privateTrip":'samplePackage'
    const tripType = isPrivateTrip
        ? "privateTrip"
        : isSamplePackage
            ? "samplePackage"
            : isGroupTrip
                ? "groupTrip"
                : null;
    const {
        loading,
        tripDetails,
        regionsImage,
        policies,
    } = useTripPdfData({ tripId, tripType });

    if (loading) {
        return <div>Loading...</div>;
    }


    return <div className="min-h-screen bg-gray-200 flex justify-center py-8 px-4 overflow-auto">
        <div className=" w-full max-w-200  bg-white shadow-2xl rounded-md p-8 ">
            {
                tripType !== 'groupTrip' ?
                    <PdfDetailsPrivateAndSample tripDetails={tripDetails} regionsImage={regionsImage} tripType={tripType} policies={policies} /> :
                    <PdfDetailsGroupTrip tripDetails={tripDetails} regionsImage={regionsImage} tripType={tripType} policies={policies} />
            }
        </div>
    </div>
}

export default PreviewPdf;