
// ===== components/Pdf/PdfCoverSection.jsx (updated hero block only shown in context) =====
import React from "react";
import { MapPin, Clock, Calendar, Users, Instagram } from "lucide-react";
import PdfImage from "./PdfImage";

const PINK = "#ED5F8D";
const NAVY = "#08255B";

function PdfCoverSection({ data }) {
  const {
    regionImage,
    regionName,
    tripLabel,
    days,
    startingPrice,
    priceSubtitle,
    tripName,
    tripOverview,
    destination,
    duration,
    travelDates,
    tripTypeText,
    orgInitial,
  } = data;

  const infoCards = [
    { icon: MapPin, label: "Destination", value: destination },
    { icon: Clock, label: "Duration", value: duration },
    { icon: Calendar, label: "Travel Dates", value: travelDates },
    { icon: Users, label: "Trip Type", value: tripTypeText },
  ];

  return (
    <div>
      {/* Hero with overlaid text */}
      <PdfImage
        src={regionImage}
        alt={regionName}
        className="w-full rounded-xl"
        style={{ height: "520px" }}
        showDummyBadge={false}
      >
        {/* Gradient scrim: darkens top (for title) and bottom (for tag/price) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Title block */}
        <div className="absolute inset-x-0 top-8 text-center px-4">
          <div className="text-3xl sm:text-6xl font-extrabold text-white uppercase tracking-wide drop-shadow-lg">
            {regionName}
          </div>
          <div className="text-lg sm:text-3xl font-semibold text-white/90 -mt-1 drop-shadow">
            TripKraftr
          </div>
          <div className="text-xs sm:text-xl font-medium text-white/90 tracking-widest mt-3 uppercase drop-shadow">
            {tripLabel} | {days} DAYS
          </div>
        </div>

        {/* Bottom-left tag */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-[11px] font-medium px-2 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <Instagram size={11} color="#ED5F8D"/>
          satynarayan.maurya
        </div>

        {/* Bottom-right price card */}
        <div className="absolute bottom-3 right-3 bg-white rounded-lg px-4 py-2 shadow-md text-center">
          <div className="text-lg font-bold" style={{ color: PINK }}>
            {startingPrice}
          </div>
          <div className="text-[10px] text-gray-400">{priceSubtitle}</div>
        </div>
      </PdfImage>

      {/* Title + Overview + Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold" style={{ color: NAVY }}>
              TripKraftr Itinerary
              <br />
              {tripName}
            </h1>
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: NAVY }}
            >
              {orgInitial}
            </div>
          </div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: NAVY }}>
            Overview
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {tripOverview || "No overview added yet."}
          </p>
        </div>

        <div className="space-y-3">
          {infoCards.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-lg p-3"
              style={{ background: "#FDF1F5" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: PINK, color: "#fff" }}
              >
                <Icon size={15} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">{label}</div>
                <div className="text-sm font-medium" style={{ color: NAVY }}>
                  {value || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PdfCoverSection;