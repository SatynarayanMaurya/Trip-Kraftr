// ===== components/Pdf/PdfPricingHighlights.jsx =====
import React from "react";
import PdfImage from "./PdfImage";

const PINK = "#ED5F8D";
const NAVY = "#08255B";
const BLUE = '#9CBFFF57'

function PdfPricingHighlights({ price, activities,tripType='privateTrip',tripDetails={} }) {
  // const rows = [
  //   { label: "Base Cost", value: price?.baseCost },
  //   { label: "Additional Activities", value: price?.additionalActivities },
  //   { label: "Festival Surge", value: price?.festivalSurge },
  //   { label: "Discount", value: price?.discount ? `- ${price.discount}` : 0 },
  //   price?.isGstChecked ? { label: "GST", value: price?.gstPrice } : null,
  // ].filter(Boolean);

      const rowsPrivateTrip = [
        { label: "Base Cost", value: price?.baseCost },
        { label: "Additional Activities", value: price?.additionalActivities },
        { label: "Festival Surge", value: price?.festivalSurge },
        {
            label: "Discount",
            value: price?.discount ? `- ${price.discount}` : 0,
        },
        price?.isGstChecked
            ? { label: "GST", value: price?.gstPrice }
            : null,
    ].filter(Boolean);

    const rowsGroupTrip = [
        { label: "Single Occupancy", value: tripDetails?.tripDetails?.occupancy?.single },
        { label: "Double Occupancy", value: tripDetails?.tripDetails?.occupancy?.double },
        { label: "Triple Occupancy", value: tripDetails?.tripDetails?.occupancy?.triple },
    ].filter(Boolean);

       const rowsSamplePackage = [
        { label: "Total Price", value: price?.totalPrice },
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
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-sm py-1.5" style={{ color: "#CBD5E1" }}>
            <span>{r.label}</span>
            <span className="font-medium text-white">{fmt(r.value)}</span>
          </div>
        ))}
        <div className="border-t border-white/20 my-2" />
        <div className="flex justify-between text-sm font-bold py-1">
          <span style={{ color: PINK }}>Final Price</span>
          <span className="text-white">{fmt(price?.finalPrice)}</span>
        </div>
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