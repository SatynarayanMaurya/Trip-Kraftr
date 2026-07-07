import React from "react";
import { Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import PdfCoverSectionPdf from "./PdfCoverSectionPDF";
import PdfPricingHighlightsPdf from "./PdfPricingHighlightsPDF";
import PdfPoliciesPDF from "./PdfPoliciesPDF";
import PdfDayDetailsPDF from "./PdfDayDetailsPDF";
import PdfContactFooterPDF from "./PdfContactFooterPDF";

// import PdfCoverSection from "./PdfSections/PdfCoverSection";
// import PdfPricingHighlights from "./PdfSections/PdfPricingHighlights";
// import PdfDayDetails from "./PdfSections/PdfDayDetails";
// import PdfPolicies from "./PdfSections/PdfPolicies";
// import PdfContactFooter from "./PdfSections/PdfContactFooter";

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        padding: 24,
    },
});

function getRegionImage(regionsImage) {
    if (!regionsImage) return null;
    const obj = Array.isArray(regionsImage) ? regionsImage[0] : regionsImage;
    return obj?.region_images?.[0] || null;
}

function formatDate(dateStr) {
    if (!dateStr) return null;

    const d = new Date(dateStr);

    if (isNaN(d)) return null;

    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function addDays(dateStr, days) {
    if (!dateStr || !days) return null;

    const d = new Date(dateStr);

    if (isNaN(d)) return null;

    d.setDate(d.getDate() + (Number(days) - 1));

    return d;
}

export default function TripPdfGroupTrip({
    tripDetails, regionsImage, policies,
    tripType = "privateTrip"
}) {

    const itinerary = tripDetails?.itineraryBuilder || {};
    const daysDetails = itinerary?.daysDetails || [];
    const regionDetails = tripDetails?.regionDetails || {};
    const price = tripDetails?.price || {};

    const regionName = regionDetails?.region1?.name || "Trip";

    const destination = [
        regionDetails?.region1?.name,
        regionDetails?.region2?.name,
        regionDetails?.region3?.name,
    ]
        .filter(Boolean)
        .join(", ");

    const startDate = formatDate(regionDetails?.fromDate);



    const tripTypeText = `GROUP TRIP`;
    const from = new Date(regionDetails?.fromDate);
    const to = new Date(regionDetails?.toDate);

    const diffTime = to - from;

    // convert ms → days
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const duration =
        from && to && diffDays > 0
            ? `${diffDays + 1} Days / ${diffDays} Nights`
            : null;

    const coverData = {
        regionImage: getRegionImage(regionsImage),
        regionName,
        tripLabel:
            tripType === "privateTrip"
                ? "PRIVATE TRIP"
                : "SAMPLE PACKAGE",
        days: regionDetails?.noOfDays || daysDetails.length,
        startingPrice: `${Number(tripDetails?.tripDetails?.occupancy?.single || 0).toLocaleString("en-IN")}`,
        priceSubtitle: '/ Single Person',
        tripName: itinerary?.tripName || "Untitled Trip",
        tripOverview: itinerary?.tripOverview,
        destination,
        duration,
        travelDates: startDate
            ? `${startDate}`
            : null,
        tripTypeText,
        orgInitial: "TK",
    };

    const highlightActivities = daysDetails
        .flatMap((day) => day?.activities || [])
        .filter(Boolean)
        .map((a) => ({
            name: a?.activityName,
            isComplimentary: a?.isComplimentary,
            image: a?.activityId?.imageUrl,
            description: a?.activityId?.description,
            notes: a?.activityId?.notes,
        }))
        .filter((a) => a.name);

    const days = daysDetails.map((day, idx) => {
        const rooms = day?.hotelDetails?.rooms || [];
        const placeDetails = day?.placeDetails || [];

        const favouritePlace = placeDetails.find(
            (p) => p?.isFavourite
        )?.placeId;

        const placeImage =
            favouritePlace?.imageUrl ||
            placeDetails?.[0]?.placeId?.imageUrl ||
            null;

        return {
            dayNumber: idx + 1,
            dayOverview: day?.dayOverview,

            hotel: {
                name: day?.hotelDetails?.hotelName,
                category: day?.hotelDetails?.hotelCategory,
                image: day?.hotelDetails?.hotelImage,
                rooms: [{ meals: day?.hotelDetails?.meals, roomType: day?.hotelDetails?.roomType }],
            },

            places: placeDetails
                .map((p) => p?.placeId?.placeName)
                .filter(Boolean),

            placeImage,

            activities: (day?.activities || [])
                .map((a) => a?.activityName)
                .filter(Boolean),

            vehicleDetails: (day?.vehicleDetails || []).filter(
                (v) => v?.vehicleId
            ),
        };
    });

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap>
                <PdfCoverSectionPdf data={coverData} />

                <PdfPricingHighlightsPdf
                    price={price}
                    activities={highlightActivities}
                    tripType={tripType}
                    tripDetails={tripDetails}
                />

                <PdfDayDetailsPDF days={days}  tripType={tripType}  tripDetails={tripDetails} />

                <PdfPoliciesPDF policies={policies} />

                <PdfContactFooterPDF />
            </Page>
        </Document>
    );
}
