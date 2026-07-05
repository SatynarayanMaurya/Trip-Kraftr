// ===== components/Pdf/PdfDayDetails.jsx =====
import React from "react";
import { MapPin, Star } from "lucide-react";
import PdfImage from "./PdfImage";

const PINK = "#ED5F8D";
const NAVY = "#08255B";

const MEAL_PLAN_LABELS = {
    cp: "Breakfast",
    map: "Breakfast, Dinner",
    ap: "All Meals",
    ep: "Room Only",
};

function getMealsText(rooms) {
    const plans = [...new Set(rooms.map((r) => r?.mealPlan).filter(Boolean))];
    if (plans.length === 0) return "—";
    return plans.map((p) => MEAL_PLAN_LABELS[p] || p.toUpperCase()).join(", ");
}

function PdfDayDetails({ days }) {
    return (
        <div className="mt-8 space-y-8">
            {days.map((day) => (
                <div key={day.dayNumber}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: PINK }}>
                        Day {day.dayNumber}
                    </h3>

                    {/* Hotel card */}
                    <div className="flex relative flex-col sm:flex-row gap-4 rounded-xl p-4" style={{ background: "#FFBCD275" }}>
                        <div className="absolute top-1 right-2 flex flex-wrap justify-end gap-2 max-w-[90%] md:max-w-[45%] z-50">
                            {day?.vehicleDetails?.map((vehicle) => (
                                <span
                                    key={vehicle._id}
                                    className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2.5 py-1 text-[10px] font-semibold border border-green-200"
                                >
                                    <span>{vehicle.vehicleModel}</span>
                                    <span>×{vehicle.quantity}</span>
                                    <span>₹{vehicle.pricePerDay}</span>
                                </span>
                            ))}
                        </div>
                        <PdfImage
                            src={day.hotel.image}
                            alt={day.hotel.name}
                            className="rounded-lg shrink-0"
                            // style={{ width: "100%", maxWidth: "220px", minHeight: "150px", maxHeigth:'300px' }}
                            style={{ width: 300,  height: "auto", minHeight: 90 }}
                        />
                        <div className="min-w-0">
                            <div className="text-base font-bold" style={{ color: NAVY }}>
                                {day.hotel.name || "Hotel not selected"}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                Stay: {day.hotel.category || "—"}
                            </div>
                            <div className="text-xs font-semibold text-gray-500 mb-1">Room Details</div>
                            <div className="flex flex-wrap gap-2">
                                {day.hotel.rooms.length === 0 && (
                                    <span className="text-xs text-gray-400">No rooms added</span>
                                )}
                                {day.hotel.rooms.map((r) => (
                                    <span
                                        key={r._id}
                                        className="text-[11px] px-2 py-1 rounded-full font-medium"
                                        style={{ background: "transparent", color: NAVY, border: "1px solid #F0C4D4" }}
                                    >
                                        {r.roomType} · {(r.mealPlan || "").toUpperCase()} · EM:{r.noOfExtraMattress ?? 0} · CNB:{r.noOfCnb ?? 0}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Places + Activities */}
                    <div className="flex flex-col sm:flex-row gap-4 rounded-xl p-4 mt-4" style={{ background: "#9CBFFF57" }}>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold mb-2" style={{ color: NAVY }}>
                                {day.dayOverview || `Day ${day.dayNumber} Plan`}
                            </div>

                            <div className="text-xs font-semibold text-gray-500 mb-1">Place</div>
                            <ul className="space-y-1 mb-3">
                                {day.places.length === 0 && (
                                    <li className="text-xs text-gray-400">No places added</li>
                                )}
                                {day.places.map((p, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPin size={13} style={{ color: PINK }} className="shrink-0" />
                                        {p}
                                    </li>
                                ))}
                            </ul>

                            <div className="text-xs font-semibold text-gray-500 mb-1">Activities</div>
                            <ul className="space-y-1">
                                {day.activities.length === 0 && (
                                    <li className="text-xs text-gray-400">No activities added</li>
                                )}
                                {day.activities.map((a, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <Star size={13} style={{ color: PINK }} className="shrink-0" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PdfImage
                            src={day.placeImage}
                            alt="Favourite place"
                            className="rounded-lg shrink-0"
                            style={{ width: 300,  height: "auto", minHeight: 100 }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PdfDayDetails;