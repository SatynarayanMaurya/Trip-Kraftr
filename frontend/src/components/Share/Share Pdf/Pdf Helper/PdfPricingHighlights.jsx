// ===== components/Pdf/PdfPricingHighlights.jsx =====
import React from "react";
import PdfImage from "./PdfImage";

const PINK = "#ED5F8D";
const NAVY = "#08255B";
const BLUE = '#9CBFFF57'

function PdfPricingHighlights({ price, activities, tripType = 'privateTrip', tripDetails = {} }) {

  const allActivities = tripDetails?.itineraryBuilder?.daysDetails?.flatMap(day =>
    day.activities?.filter(activity => activity.activityName?.trim()) || []
  ) || [];

  const rowsPrivateTrip = [
    { label: "Total Package Cost", value: price?.finalPrice, show: true, highlight: false },
    { label: "Additional Activities", value: price?.additionalActivities, show: true, highlight: false },
    { label: "+ GST (5%) ", value: price?.gstPrice, show: price?.isGstChecked, highlight: false },
    { label: "Discount Applied", value: price?.discount, show: price?.discount > 0, highlight: false },
    { label: "Festival Surge", value: price?.festivalSurge, show: price?.festivalSurge > 0, highlight: false },
    ...allActivities.map((activity) => ({label: `${activity.activityName} (Activity)`, value: activity.isComplimentary ? 0 : activity.price, show: price?.showBreakUp, highlight: false,
  })),
  { label: "Final Price", value: price?.discountedPrice, show: true, highlight: true },
  ].filter(Boolean);

  const rowsGroupTrip = [
    { label: "Single Occupancy", value: tripDetails?.tripDetails?.occupancy?.single, show: true },
    { label: "Double Occupancy", value: tripDetails?.tripDetails?.occupancy?.double, show: true },
    { label: "Triple Occupancy", value: tripDetails?.tripDetails?.occupancy?.triple, show: true },
  ].filter(Boolean);

  const rowsSamplePackage = [
    { label: "Total Price", value: price?.totalPrice, show: true },
  ].filter(Boolean);

  const rowsMap = {
    privateTrip: rowsPrivateTrip,
    groupTrip: rowsGroupTrip,
    samplePackage: rowsSamplePackage, // add when ready
  };

  const rows = rowsMap[tripType] || [];

  const fmt = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

  return (
    <div className="mt-8">
      {/* Pricing */}
      <h3 className="text-base font-bold mb-3" style={{ color: NAVY }}>
        Pricing Details
      </h3>
      <div className="rounded-xl p-4" style={{ background: NAVY }}>
        {rows?.filter(r => r.show).map((r) => (
          <React.Fragment key={r.label}>
            {r.highlight && <div className="border-t border-white/20 my-2" />}

            <div
              className={`flex justify-between text-sm py-1.5 ${r.highlight ? "font-bold" : ""
                }`}
            >
              <span style={{ color: r.highlight ? PINK : "#CBD5E1" }}>
                {r.label}
              </span>

              <span
                className={r.highlight ? "font-bold" : "font-medium"}
                style={{ color: r.highlight ? PINK : "#fff" }}
              >
                {fmt(r.value)}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Highlights */}
      <h3 className="text-base font-bold mt-8 mb-3" style={{ color: NAVY }}>
        Trip Highlights
      </h3>
      <div className="space-y-3">
        {activities.length === 0 && (
          <div className="text-sm text-gray-400">No activities added yet.</div>
        )}
        {activities.map((a, i) => (
          <div
            key={`${a.name}-${i}`}
            className="flex lg:flex-row flex-col gap-3 rounded-lg p-2"
            style={{ background: "#9CBFFF57" }}
          >
            <PdfImage
              src={a.image}
              alt={a.name}
              className="rounded-md shrink-0"
              style={{ width: 300, height: 150 }}
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold" style={{ color: NAVY }}>
                {a.name} {a.isComplimentary ? "(Complimentary)" : ""}
              </div>
              <div className="text-xs text-gray-500 line-clamp-2">
                {a.notes || "No description available."}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PdfPricingHighlights;