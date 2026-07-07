

// ===== PdfDetailsPrivateAndSample.jsx =====
import React, { useState } from "react";
import PdfCoverSection from "./Pdf Helper/PdfCoverSection";
import PdfPricingHighlights from "./Pdf Helper/PdfPricingHighlights";
import PdfDayDetails from "./Pdf Helper/PdfDayDetails";
import PdfPolicies from "./Pdf Helper/PdfPolicies";
import PdfContactFooter from "./Pdf Helper/PdfContactFooter";
import { Download } from 'lucide-react'
import TripPdf from "./Trip Pdf/TripPdf";
import { pdf } from "@react-pdf/renderer";
import TripPdfGroupTrip from "./Trip Pdf/TripPdfGroupTrip";
import {toast} from 'react-toastify'
function getRegionImage(regionsImage) {
  if (!regionsImage) return null;
  const obj = Array.isArray(regionsImage) ? regionsImage[0] : regionsImage;
  return obj?.region_images?.[0] || null;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function addDays(dateStr, days) {
  if (!dateStr || !days) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  d.setDate(d.getDate() + (Number(days) - 1));
  return d;
}

function PdfDetailsGroupTrip({ tripDetails, regionsImage, policies, tripType = "privateTrip" }) {
  if (!tripDetails) return null;

  const [pdfLoading, setPdfLoading] = useState(false)


  const itinerary = tripDetails?.itineraryBuilder || {};
  const daysDetails = itinerary?.daysDetails || [];
  const regionDetails = tripDetails?.regionDetails || {};
  const price = tripDetails?.price || {};

  const regionName = regionDetails?.region1?.name || "Trip";
  const destination = [regionDetails?.region1?.name, regionDetails?.region2?.name, regionDetails?.region3?.name]
    .filter(Boolean)
    .join(", ");

  const startDate = formatDate(regionDetails?.fromDate);
  const endDateObj = addDays(regionDetails?.fromDate, (regionDetails?.toDate - regionDetails?.fromDate));
  const endDate = endDateObj ? formatDate(toDate) : null;

  const totalPersons = (regionDetails?.adults || 0) + (regionDetails?.children || 0);
  const tripTypeText = `GROUP TRIP`;

  const coverData = {
    regionImage: getRegionImage(regionsImage),
    regionName,
    tripLabel: "GROUP TRIP",
    days: regionDetails?.noOfDays || daysDetails.length,
    startingPrice: `₹${Number(tripDetails?.tripDetails?.occupancy?.single || 0).toLocaleString("en-IN")}`,
    priceSubtitle: '/ Single Person',
    tripName: itinerary?.tripName || "Untitled Trip",
    tripOverview: itinerary?.tripOverview,
    destination,
    duration: regionDetails?.noOfDays ? `${regionDetails.noOfDays} Days / ${regionDetails.noOfDays - 1} Nights` : null,
    travelDates: startDate ? startDate : null,
    tripTypeText,
    orgInitial: "TK",
  };

  // Collect all activities across all days for Trip Highlights
  const highlightActivities = daysDetails
    .flatMap((day) => day?.activities || [])
    .filter(Boolean)
    .map((a) => ({
      name: a?.activityName,
      isComplimentary: a?.isComplimentary,
      image: a?.activityId?.imageUrl || null,
      notes: a?.activityId?.notes,
    }))
    .filter((a) => a.name);

  // Process each day
  const days = daysDetails.map((day, idx) => {
    const rooms = day?.hotelDetails?.rooms || [];
    const placeDetails = day?.placeDetails || [];
    const favouritePlace = placeDetails.find((p) => p?.isFavourite)?.placeId;
    const placeImage = favouritePlace?.imageUrl || placeDetails?.[0]?.placeId?.imageUrl || null;

    return {
      dayNumber: idx + 1,
      dayOverview: day?.dayOverview,
      hotel: {
        name: day?.hotelDetails?.hotelName,
        category: day?.hotelDetails?.hotelCategory,
        image: day?.hotelDetails?.hotelImage,
        rooms: [{ meals: day?.hotelDetails?.meals, roomType: day?.hotelDetails?.roomType }],
      },
      places: placeDetails.map((p) => p?.placeId?.placeName).filter(Boolean),
      placeImage,
      activities: (day?.activities || []).map((a) => a?.activityName).filter(Boolean),
      vehicleDetails: (day?.vehicleDetails || [])?.filter(val => val?.vehicleId).filter(Boolean),
    };
  });

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true)
      const blob = await pdf(
        <TripPdfGroupTrip
          tripDetails={tripDetails}
          regionsImage={regionsImage}
          policies={policies}
          tripType={tripType}
        />
      ).toBlob();

      setPdfLoading(false)
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "Trip.pdf";

      link.click();

      URL.revokeObjectURL(url);
    }
    catch (error) {
      console.log("Error in download the pdf : ", error)
      toast.error(error?.message || "Error in download the pdf")
    }

  };

  return (
    <>
      <div>
        <PdfCoverSection data={coverData} />
        <PdfPricingHighlights price={price} activities={highlightActivities} tripType="groupTrip" tripDetails={tripDetails} />
        <PdfDayDetails days={days} tripDetails={tripDetails} tripType="groupTrip" />
        <PdfPolicies policies={policies} />
        <PdfContactFooter />
      </div>


      <button
        onClick={handleDownloadPdf}
        disabled={pdfLoading}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-xl transition active:scale-95 ${pdfLoading
            ? "cursor-not-allowed bg-blue-400"
            : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {pdfLoading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <Download size={18} />
            Download PDF
          </>
        )}
      </button>
    </>
  );
}


export default PdfDetailsGroupTrip
