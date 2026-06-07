


import React, { useEffect, useState } from "react";

const PINK = "#ED5F8D";
const NAVY = "#18305C";

export default function PriceSection({ price, setPrice, noOfDays = 1 }) {
    const [isMarginMode, setIsMarginMode] = useState(price.isMargin ?? true);
    const [actOpen, setActOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const update = (fields) => setPrice((prev) => ({ ...prev, ...fields }));

    const onMarginSlide = (val) => {
        setIsMarginMode(true);
        update({ margin: Number(val), isMargin: true });
    };

    const onCommissionInput = (val) => {
        setIsMarginMode(false);
        update({ commission: Math.max(0, Number(val) || 0), isMargin: false });
    };

    const onSurgeInput = (val) => {
        const v = Math.min(50000, Math.max(0, Number(val) || 0));
        update({ festivalSurge: v });
    };

    const onDiscountInput = (val) => {
        const v = Math.min(50000, Math.max(0, Number(val) || 0));
        update({ discount: v });
    };

    const fmt = (v) => "₹" + Math.round(v || 0).toLocaleString("en-IN");
    const fmt2 = (v) => "₹" + (v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const nights = Math.max(0, (noOfDays || 1) - 1);

    const handleMarginChange = (e) => {
        const sliderValue = Number(e.target.value);

        setPrice(prev => ({
            ...prev,
            margin: prev.min_margin + sliderValue,
        }));
    };


    /* ── shared card markup ── */
    const Card = () => (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                width: 340,
                border: `2px solid ${NAVY}`,
                boxShadow: "0 4px 24px rgba(24,48,92,0.18)",
            }}
        >
            {/* ── NAVY TOP ── */}
            <div className="px-4 py-4" style={{ background: NAVY }}>

                {/* Show Breakup */}
                <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-white text-sm font-semibold cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={price.showBreakUp}
                            onChange={(e) => update({ showBreakUp: e.target.checked })}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: PINK }}
                        />
                        Show Breakup
                    </label>
                    <button type="button" className="text-base bg-transparent border-none cursor-pointer" style={{ color: "#a8bcd4" }}>✏️</button>
                </div>

                {/* Trip Duration */}
                <div className="mb-1">
                    <div className="text-xs mb-0.5" style={{ color: "#a8bcd4" }}>Trip Duration</div>
                    <div className="text-sm font-bold text-white">{nights} Nights / {noOfDays} Days</div>
                </div>

                {/* Base Cost */}
                <div className="text-xs font-medium text-white mb-3">Base Cost : {fmt2(price.baseCost)}</div>

                {/* Margin / Commission toggle */}
                <div className="flex rounded-lg overflow-hidden mb-3" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                    {[{ label: "Margin", active: isMarginMode, onClick: () => { setIsMarginMode(true); update({ isMargin: true }); } },
                    { label: "Commission", active: !isMarginMode, onClick: () => { setIsMarginMode(false); update({ isMargin: false }); } }]
                        .map(({ label, active, onClick }, i) => (
                            <button
                                key={label}
                                type="button"
                                onClick={onClick}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all"
                                style={{
                                    background: active ? "rgba(255,255,255,0.12)" : "transparent",
                                    color: active ? "#fff" : "#a8bcd4",
                                    border: "none",
                                    borderLeft: i === 1 ? "1px solid rgba(255,255,255,0.15)" : "none",
                                    cursor: "pointer",
                                }}
                            >
                                <span className="w-2.5 h-2.5 rounded-full border-2 shrink-0"
                                    style={{ borderColor: active ? PINK : "#a8bcd4", background: active ? PINK : "transparent" }} />
                                {label}
                            </button>
                        ))}
                </div>

                {/* Margin slider */}
                {isMarginMode && (
                    <div className="mb-1">
                        <div className="flex justify-between mb-0.5">
                            <span
                                className="text-xs"
                                style={{ color: "#a8bcd4" }}
                            >
                                0
                            </span>

                            <span
                                className="text-xs"
                                style={{ color: "#a8bcd4" }}
                            >
                                {price.max_margin - price.min_margin}
                            </span>
                        </div>

                        <input
                            type="range"
                            min={0}
                            max={price.max_margin - price.min_margin}
                            step={1}
                            value={price.margin - price.min_margin}
                            onChange={handleMarginChange}
                            className="w-full cursor-pointer"
                            style={{ accentColor: PINK }}
                        />

                        <div
                            className="text-center text-xs mt-0.5"
                            style={{ color: "#a8bcd4" }}
                        >
                            {price.margin - price.min_margin}
                        </div>
                    </div>
                )}

                {/* Commission input */}
                {!isMarginMode && (
                    <input type="number" min={0} placeholder="Commission Amount"
                        value={price.commission || ""}
                        onFocus={() => console.log("focus")}
    onBlur={() => console.log("blur")}
                        // onChange={(e) => onCommissionInput(e.target.value)}
                        onChange={(e) => {
                            console.log("change", e.target.value);
                            onCommissionInput(e.target.value);
                        }}
                    
                        className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }} />
                )}
            </div>

            {/* ── WHITE BOTTOM ── */}
            <div className="px-4 py-3 bg-white">

                {/* Additional Activities */}
                <div className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => setActOpen(p => !p)} role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActOpen(p => !p)}>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: NAVY }}>Additional Activities</span>
                        <span className="text-sm font-bold" style={{ color: NAVY }}>{fmt(price.additionalActivities)}</span>
                    </div>
                    <span className="text-sm transition-transform duration-200"
                        style={{ color: NAVY, display: "inline-block", transform: actOpen ? "rotate(180deg)" : "none" }}>⌄</span>
                </div>

                <hr className="border-t border-gray-100 my-2" />

                {/* Total Cost */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Total Cost</span>
                    <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price.totalCost)}</span>
                </div>

                {/* Festival Surge */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#555" }} />
                    <span className="text-xs text-gray-500 flex-1">Festival Surge</span>
                    <input type="number" min={0} max={50000} value={price.festivalSurge || ""}
                        onChange={(e) => onSurgeInput(e.target.value)}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
                        style={{ color: NAVY }} />
                </div>
                <div className="mb-2.5">
                    <input type="range" min={0} max={50000} step={500} value={price.festivalSurge || 0}
                        onChange={(e) => onSurgeInput(e.target.value)}
                        className="w-full cursor-pointer" style={{ accentColor: "#555" }} />
                </div>

                {/* Discount */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#22c55e" }} />
                    <span className="text-xs text-gray-500 flex-1">Discount</span>
                    <input type="number" min={0} max={50000} value={price.discount || ""}
                        onChange={(e) => onDiscountInput(e.target.value)}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
                        style={{ color: NAVY }} />
                </div>
                <div className="mb-2.5">
                    <input type="range" min={0} max={50000} step={500} value={price.discount || 0}
                        onChange={(e) => onDiscountInput(e.target.value)}
                        className="w-full cursor-pointer" style={{ accentColor: "#22c55e" }} />
                </div>

                <hr className="border-t border-gray-100 my-2" />

                {/* GST */}
                <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="w-4 h-4 rounded shrink-0" style={{ background: "#FBEAF0" }} />
                        <span className="text-xs text-gray-500">GST @5%</span>
                        <input type="checkbox" checked={price.isGstChecked}
                            onChange={(e) => update({ isGstChecked: e.target.checked })}
                            className="w-3.5 h-3.5 cursor-pointer ml-1" style={{ accentColor: PINK }} />
                    </label>
                    <span className="text-sm font-bold" style={{ color: PINK }}>{fmt(price.gstPrice)}</span>
                </div>

                <hr className="border-t border-gray-100 my-2" />

                {/* Show Price / Adult */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-4 h-4 rounded shrink-0" style={{ background: PINK }} />
                    <span className="text-sm font-bold" style={{ color: NAVY }}>Show Price / Adult</span>
                </div>

                {/* Final Price */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Final Price / Adult</span>
                    <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price.finalPrice)}</span>
                </div>

                {/* Discounted Price */}
                <div className="flex items-start justify-between">
                    <span className="text-xs text-gray-500">Discounted Price / Adult</span>
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 line-through">{fmt(price.finalPrice)}</span>
                        <span className="block text-sm font-bold" style={{ color: PINK }}>{fmt(price.discountedPrice)}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ══ DESKTOP: fixed card top-right — out of document flow, zero space ══ */}
            <div
                className="hidden sm:block"
                style={{ position: "fixed", top: 80, right: 24, zIndex: 50 }}
            >
                <Card />
            </div>

            {/* ══ MOBILE: floating pill button + bottom drawer ══ */}
            <div className="sm:hidden">
                {/* Sticky pill button */}
                <div className="sticky top-0 z-50 flex justify-end px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)" }}>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
                        style={{ background: NAVY }}
                    >
                        <span style={{ color: PINK }}>₹</span>
                        <span>Price Summary</span>
                        <span style={{ color: PINK, fontSize: 10 }}>▲</span>
                    </button>
                </div>

                {/* Backdrop */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)" }}
                        onClick={() => setMobileOpen(false)} />
                )}

                {/* Bottom drawer */}
                <div
                    className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-y-auto transition-transform duration-300 ease-out"
                    style={{
                        maxHeight: "90vh",
                        transform: mobileOpen ? "translateY(0)" : "translateY(100%)",
                        boxShadow: "0 -6px 30px rgba(0,0,0,0.2)",
                        background: "white",
                    }}
                >
                    {/* Handle bar */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: `1px solid #f0f0f0` }}>
                        <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                        <span className="text-sm font-bold" style={{ color: NAVY }}>Price Summary</span>
                        <button type="button" onClick={() => setMobileOpen(false)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xl leading-none">
                            ×
                        </button>
                    </div>
                    {/* Full-width card inside drawer */}
                    <div className="p-3">
                        <div
                            className="rounded-2xl overflow-hidden w-full"
                            style={{ border: `2px solid ${NAVY}`, boxShadow: "0 4px 24px rgba(24,48,92,0.18)" }}
                        >
                            <Card />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



// import React, { useState } from "react";

// const PINK = "#ED5F8D";
// const NAVY = "#18305C";

// export default function PriceSection({ price, setPrice, noOfDays = 1 }) {
//   const [isMarginMode, setIsMarginMode] = useState(price.isMargin ?? true);
//   const [actOpen, setActOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const update = (fields) => setPrice((prev) => ({ ...prev, ...fields }));

//   const onMarginSlide = (val) => {
//     setIsMarginMode(true);
//     update({ margin: Number(val), isMargin: true });
//   };

//   const onCommissionInput = (val) => {
//     setIsMarginMode(false);
//     update({ commission: Math.max(0, Number(val) || 0), isMargin: false });
//   };

//   const onSurgeInput = (val) => {
//     const v = Math.min(50000, Math.max(0, Number(val) || 0));
//     update({ festivalSurge: v });
//   };

//   const onDiscountInput = (val) => {
//     const v = Math.min(50000, Math.max(0, Number(val) || 0));
//     update({ discount: v });
//   };

//   const fmt  = (v) => "₹" + Math.round(v || 0).toLocaleString("en-IN");
//   const fmt2 = (v) => "₹" + (v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   const nights = Math.max(0, (noOfDays || 1) - 1);

//   /* ── shared card markup ── */
//   const Card = () => (
//     <div
//       className="rounded-2xl overflow-hidden"
//       style={{
//         width: 340,
//         border: `2px solid ${NAVY}`,
//         boxShadow: "0 4px 24px rgba(24,48,92,0.18)",
//       }}
//     >
//       {/* ── NAVY TOP ── */}
//       <div className="px-4 py-4" style={{ background: NAVY }}>

//         {/* Show Breakup */}
//         <div className="flex items-center justify-between mb-3">
//           <label className="flex items-center gap-2 text-white text-sm font-semibold cursor-pointer select-none">
//             <input
//               type="checkbox"
//               checked={price.showBreakUp}
//               onChange={(e) => update({ showBreakUp: e.target.checked })}
//               className="w-4 h-4 cursor-pointer"
//               style={{ accentColor: PINK }}
//             />
//             Show Breakup
//           </label>
//           <button type="button" className="text-base bg-transparent border-none cursor-pointer" style={{ color: "#a8bcd4" }}>✏️</button>
//         </div>

//         {/* Trip Duration */}
//         <div className="mb-1">
//           <div className="text-xs mb-0.5" style={{ color: "#a8bcd4" }}>Trip Duration</div>
//           <div className="text-sm font-bold text-white">{nights} Nights / {noOfDays} Days</div>
//         </div>

//         {/* Base Cost */}
//         <div className="text-xs font-medium text-white mb-3">Base Cost : {fmt2(price.baseCost)}</div>

//         {/* Margin / Commission toggle */}
//         <div className="flex rounded-lg overflow-hidden mb-3" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
//           {[{ label: "Margin", active: isMarginMode, onClick: () => { setIsMarginMode(true); update({ isMargin: true }); } },
//             { label: "Commission", active: !isMarginMode, onClick: () => { setIsMarginMode(false); update({ isMargin: false }); } }]
//             .map(({ label, active, onClick }, i) => (
//               <button
//                 key={label}
//                 type="button"
//                 onClick={onClick}
//                 className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all"
//                 style={{
//                   background: active ? "rgba(255,255,255,0.12)" : "transparent",
//                   color: active ? "#fff" : "#a8bcd4",
//                   border: "none",
//                   borderLeft: i === 1 ? "1px solid rgba(255,255,255,0.15)" : "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 <span className="w-2.5 h-2.5 rounded-full border-2 shrink-0"
//                   style={{ borderColor: active ? PINK : "#a8bcd4", background: active ? PINK : "transparent" }} />
//                 {label}
//               </button>
//             ))}
//         </div>

//         {/* Margin slider */}
//         {isMarginMode && (
//           <div className="mb-1">
//             <div className="flex justify-between mb-0.5">
//               <span className="text-xs" style={{ color: "#a8bcd4" }}>{price.min_margin}</span>
//               <span className="text-xs" style={{ color: "#a8bcd4" }}>{price.max_margin}</span>
//             </div>
//             <input type="range" min={price.min_margin} max={price.max_margin} step={1}
//               value={price.margin} onChange={(e) => onMarginSlide(e.target.value)}
//               className="w-full cursor-pointer" style={{ accentColor: PINK }} />
//             <div className="text-center text-xs mt-0.5" style={{ color: "#a8bcd4" }}>{price.margin}</div>
//           </div>
//         )}

//         {/* Commission input */}
//         {!isMarginMode && (
//           <input type="number" min={0} placeholder="Commission Amount"
//             value={price.commission || ""}
//             onChange={(e) => onCommissionInput(e.target.value)}
//             className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
//             style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }} />
//         )}
//       </div>

//       {/* ── WHITE BOTTOM ── */}
//       <div className="px-4 py-3 bg-white">

//         {/* Additional Activities */}
//         <div className="flex items-center justify-between cursor-pointer mb-2"
//           onClick={() => setActOpen(p => !p)} role="button" tabIndex={0}
//           onKeyDown={(e) => e.key === "Enter" && setActOpen(p => !p)}>
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-bold" style={{ color: NAVY }}>Additional Activities</span>
//             <span className="text-sm font-bold" style={{ color: NAVY }}>{fmt(price.additionalActivities)}</span>
//           </div>
//           <span className="text-sm transition-transform duration-200"
//             style={{ color: NAVY, display: "inline-block", transform: actOpen ? "rotate(180deg)" : "none" }}>⌄</span>
//         </div>

//         <hr className="border-t border-gray-100 my-2" />

//         {/* Total Cost */}
//         <div className="flex items-center justify-between mb-3">
//           <span className="text-xs text-gray-500">Total Cost</span>
//           <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price.totalCost)}</span>
//         </div>

//         {/* Festival Surge */}
//         <div className="flex items-center gap-2 mb-1">
//           <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#555" }} />
//           <span className="text-xs text-gray-500 flex-1">Festival Surge</span>
//           <input type="number" min={0} max={50000} value={price.festivalSurge || ""}
//             onChange={(e) => onSurgeInput(e.target.value)}
//             className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
//             style={{ color: NAVY }} />
//         </div>
//         <div className="mb-2.5">
//           <input type="range" min={0} max={50000} step={500} value={price.festivalSurge || 0}
//             onChange={(e) => onSurgeInput(e.target.value)}
//             className="w-full cursor-pointer" style={{ accentColor: "#555" }} />
//         </div>

//         {/* Discount */}
//         <div className="flex items-center gap-2 mb-1">
//           <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#22c55e" }} />
//           <span className="text-xs text-gray-500 flex-1">Discount</span>
//           <input type="number" min={0} max={50000} value={price.discount || ""}
//             onChange={(e) => onDiscountInput(e.target.value)}
//             className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
//             style={{ color: NAVY }} />
//         </div>
//         <div className="mb-2.5">
//           <input type="range" min={0} max={50000} step={500} value={price.discount || 0}
//             onChange={(e) => onDiscountInput(e.target.value)}
//             className="w-full cursor-pointer" style={{ accentColor: "#22c55e" }} />
//         </div>

//         <hr className="border-t border-gray-100 my-2" />

//         {/* GST */}
//         <div className="flex items-center justify-between mb-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <span className="w-4 h-4 rounded shrink-0" style={{ background: "#FBEAF0" }} />
//             <span className="text-xs text-gray-500">GST @5%</span>
//             <input type="checkbox" checked={price.isGstChecked}
//               onChange={(e) => update({ isGstChecked: e.target.checked })}
//               className="w-3.5 h-3.5 cursor-pointer ml-1" style={{ accentColor: PINK }} />
//           </label>
//           <span className="text-sm font-bold" style={{ color: PINK }}>{fmt(price.gstPrice)}</span>
//         </div>

//         <hr className="border-t border-gray-100 my-2" />

//         {/* Show Price / Adult */}
//         <div className="flex items-center gap-2 mb-3">
//           <span className="w-4 h-4 rounded shrink-0" style={{ background: PINK }} />
//           <span className="text-sm font-bold" style={{ color: NAVY }}>Show Price / Adult</span>
//         </div>

//         {/* Final Price */}
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-xs text-gray-500">Final Price / Adult</span>
//           <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price.finalPrice)}</span>
//         </div>

//         {/* Discounted Price */}
//         <div className="flex items-start justify-between">
//           <span className="text-xs text-gray-500">Discounted Price / Adult</span>
//           <div className="text-right">
//             <span className="block text-xs text-gray-400 line-through">{fmt(price.finalPrice)}</span>
//             <span className="block text-sm font-bold" style={{ color: PINK }}>{fmt(price.discountedPrice)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* ══ DESKTOP: sticky card fixed to top-right ══ */}
//       <div
//         className="hidden sm:flex justify-end sticky top-4 z-50 pointer-events-none"
//         style={{ marginBottom: -8 }}
//       >
//         <div className="pointer-events-auto">
//           <Card />
//         </div>
//       </div>

//       {/* ══ MOBILE: floating pill button + bottom drawer ══ */}
//       <div className="sm:hidden">
//         {/* Sticky pill button */}
//         <div className="sticky top-0 z-50 flex justify-end px-3 py-2"
//           style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)" }}>
//           <button
//             type="button"
//             onClick={() => setMobileOpen(true)}
//             className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
//             style={{ background: NAVY }}
//           >
//             <span style={{ color: PINK }}>₹</span>
//             <span>Price Summary</span>
//             <span style={{ color: PINK, fontSize: 10 }}>▲</span>
//           </button>
//         </div>

//         {/* Backdrop */}
//         {mobileOpen && (
//           <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)" }}
//             onClick={() => setMobileOpen(false)} />
//         )}

//         {/* Bottom drawer */}
//         <div
//           className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-y-auto transition-transform duration-300 ease-out"
//           style={{
//             maxHeight: "90vh",
//             transform: mobileOpen ? "translateY(0)" : "translateY(100%)",
//             boxShadow: "0 -6px 30px rgba(0,0,0,0.2)",
//             background: "white",
//           }}
//         >
//           {/* Handle bar */}
//           <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: `1px solid #f0f0f0` }}>
//             <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
//             <span className="text-sm font-bold" style={{ color: NAVY }}>Price Summary</span>
//             <button type="button" onClick={() => setMobileOpen(false)}
//               className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xl leading-none">
//               ×
//             </button>
//           </div>
//           {/* Full-width card inside drawer */}
//           <div className="p-3">
//             <div
//               className="rounded-2xl overflow-hidden w-full"
//               style={{ border: `2px solid ${NAVY}`, boxShadow: "0 4px 24px rgba(24,48,92,0.18)" }}
//             >
//               <Card />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import React, { useState } from "react";

// const PINK = "#ED5F8D";
// const NAVY = "#18305C";

// export default function PriceSection({ price, setPrice, noOfDays = 1 }) {
//   const [isMarginMode, setIsMarginMode] = useState(price.isMargin ?? true);
//   const [actOpen, setActOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const update = (fields) => setPrice((prev) => ({ ...prev, ...fields }));

//   const onMarginSlide = (val) => {
//     setIsMarginMode(true);
//     update({ margin: Number(val), isMargin: true });
//   };

//   const onCommissionInput = (val) => {
//     setIsMarginMode(false);
//     update({ commission: Math.max(0, Number(val) || 0), isMargin: false });
//   };

//   const onSurgeInput = (val) => {
//     const v = Math.min(50000, Math.max(0, Number(val) || 0));
//     update({ festivalSurge: v });
//   };

//   const onDiscountInput = (val) => {
//     const v = Math.min(50000, Math.max(0, Number(val) || 0));
//     update({ discount: v });
//   };

//   const fmt = (v) => "₹" + Math.round(v || 0).toLocaleString("en-IN");
//   const fmt2 = (v) =>
//     "₹" + (v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const nights = Math.max(0, (noOfDays || 1) - 1);

//   const CardContent = () => (
//     <div
//       className="rounded-2xl overflow-hidden w-full"
//       style={{ border: `2px solid ${NAVY}`, boxShadow: "0 4px 20px rgba(24,48,92,0.15)" }}
//     >
//       {/* ── Navy Top Section ── */}
//       <div className="px-4 py-4" style={{ background: NAVY }}>

//         {/* Show Breakup row */}
//         <div className="flex items-center justify-between mb-3">
//           <label className="flex items-center gap-2 text-white text-sm font-semibold cursor-pointer">
//             <input
//               type="checkbox"
//               checked={price.showBreakUp}
//               onChange={(e) => update({ showBreakUp: e.target.checked })}
//               className="w-4 h-4 cursor-pointer"
//               style={{ accentColor: PINK }}
//             />
//             Show Breakup
//           </label>
//           <button
//             type="button"
//             aria-label="Edit"
//             className="text-base bg-transparent border-none cursor-pointer"
//             style={{ color: "#a8bcd4" }}
//           >
//             ✏️
//           </button>
//         </div>

//         {/* Trip Duration */}
//         <div className="mb-1">
//           <div className="text-xs mb-0.5" style={{ color: "#a8bcd4" }}>Trip Duration</div>
//           <div className="text-sm font-semibold text-white">
//             {nights} Nights / {noOfDays} Days
//           </div>
//         </div>

//         {/* Base Cost */}
//         <div className="mb-3 text-xs font-medium text-white">
//           Base Cost : {fmt2(price.baseCost)}
//         </div>

//         {/* Margin / Commission toggle */}
//         <div
//           className="flex rounded-lg overflow-hidden mb-3"
//           style={{ border: "1px solid rgba(255,255,255,0.2)" }}
//         >
//           <button
//             type="button"
//             onClick={() => { setIsMarginMode(true); update({ isMargin: true }); }}
//             className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all"
//             style={{
//               background: isMarginMode ? "rgba(255,255,255,0.12)" : "transparent",
//               color: isMarginMode ? "#fff" : "#a8bcd4",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             <span
//               className="w-2.5 h-2.5 rounded-full border-2 flex-shrink-0"
//               style={{
//                 borderColor: isMarginMode ? PINK : "#a8bcd4",
//                 background: isMarginMode ? PINK : "transparent",
//               }}
//             />
//             Margin
//           </button>
//           <button
//             type="button"
//             onClick={() => { setIsMarginMode(false); update({ isMargin: false }); }}
//             className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold transition-all"
//             style={{
//               background: !isMarginMode ? "rgba(255,255,255,0.12)" : "transparent",
//               color: !isMarginMode ? "#fff" : "#a8bcd4",
//               border: "none",
//               borderLeft: "1px solid rgba(255,255,255,0.15)",
//               cursor: "pointer",
//             }}
//           >
//             <span
//               className="w-2.5 h-2.5 rounded-full border-2 flex-shrink-0"
//               style={{
//                 borderColor: !isMarginMode ? PINK : "#a8bcd4",
//                 background: !isMarginMode ? PINK : "transparent",
//               }}
//             />
//             Commission
//           </button>
//         </div>

//         {/* Margin slider */}
//         {isMarginMode && (
//           <div className="mb-1">
//             <div className="flex justify-between mb-0.5">
//               <span className="text-xs" style={{ color: "#a8bcd4" }}>{price.min_margin}</span>
//               <span className="text-xs" style={{ color: "#a8bcd4" }}>{price.max_margin}</span>
//             </div>
//             <input
//               type="range"
//               min={price.min_margin}
//               max={price.max_margin}
//               step={1}
//               value={price.margin}
//               onChange={(e) => onMarginSlide(e.target.value)}
//               className="w-full cursor-pointer"
//               style={{ accentColor: PINK }}
//             />
//             <div className="text-center text-xs mt-0.5" style={{ color: "#a8bcd4" }}>
//               {price.margin}
//             </div>
//           </div>
//         )}

//         {/* Commission input */}
//         {!isMarginMode && (
//           <input
//             type="number"
//             min={0}
//             placeholder="Commission Amount"
//             value={price.commission || ""}
//             onChange={(e) => onCommissionInput(e.target.value)}
//             className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
//             style={{
//               background: "rgba(255,255,255,0.1)",
//               border: "1px solid rgba(255,255,255,0.2)",
//             }}
//           />
//         )}
//       </div>

//       {/* ── White Bottom Section ── */}
//       <div className="px-4 py-3 bg-white">

//         {/* Additional Activities */}
//         <div
//           className="flex items-center justify-between cursor-pointer mb-2"
//           onClick={() => setActOpen((p) => !p)}
//           role="button"
//           tabIndex={0}
//           onKeyDown={(e) => e.key === "Enter" && setActOpen((p) => !p)}
//         >
//           <div className="flex items-center gap-1.5">
//             <span className="text-sm font-bold" style={{ color: NAVY }}>Additional Activities</span>
//             <span className="text-sm font-bold" style={{ color: NAVY }}>{fmt(price.additionalActivities)}</span>
//           </div>
//           <span
//             className="text-sm transition-transform duration-200"
//             style={{ color: NAVY, transform: actOpen ? "rotate(180deg)" : "none" }}
//           >
//             ⌄
//           </span>
//         </div>

//         <hr className="border-t border-gray-100 my-2" />

//         {/* Total Cost */}
//         <div className="flex items-center justify-between mb-3">
//           <span className="text-xs text-gray-500">Total Cost</span>
//           <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price.totalCost)}</span>
//         </div>

//         {/* Festival Surge */}
//         <div className="flex items-center gap-2 mb-1">
//           <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#555" }} />
//           <span className="text-xs text-gray-500 flex-1">Festival Surge</span>
//           <input
//             type="number"
//             min={0}
//             max={50000}
//             value={price.festivalSurge || ""}
//             onChange={(e) => onSurgeInput(e.target.value)}
//             className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
//             style={{ color: NAVY }}
//           />
//         </div>
//         <div className="mb-2.5">
//           <input
//             type="range"
//             min={0}
//             max={50000}
//             step={500}
//             value={price.festivalSurge || 0}
//             onChange={(e) => onSurgeInput(e.target.value)}
//             className="w-full cursor-pointer"
//             style={{ accentColor: "#555" }}
//           />
//         </div>

//         {/* Discount */}
//         <div className="flex items-center gap-2 mb-1">
//           <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#22c55e" }} />
//           <span className="text-xs text-gray-500 flex-1">Discount</span>
//           <input
//             type="number"
//             min={0}
//             max={50000}
//             value={price.discount || ""}
//             onChange={(e) => onDiscountInput(e.target.value)}
//             className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
//             style={{ color: NAVY }}
//           />
//         </div>
//         <div className="mb-2.5">
//           <input
//             type="range"
//             min={0}
//             max={50000}
//             step={500}
//             value={price.discount || 0}
//             onChange={(e) => onDiscountInput(e.target.value)}
//             className="w-full cursor-pointer"
//             style={{ accentColor: "#22c55e" }}
//           />
//         </div>

//         <hr className="border-t border-gray-100 my-2" />

//         {/* GST */}
//         <div className="flex items-center justify-between mb-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <span className="w-4 h-4 rounded flex-shrink-0" style={{ background: "#FBEAF0" }} />
//             <span className="text-xs text-gray-500">GST @5%</span>
//             <input
//               type="checkbox"
//               checked={price.isGstChecked}
//               onChange={(e) => update({ isGstChecked: e.target.checked })}
//               className="w-3.5 h-3.5 cursor-pointer ml-1"
//               style={{ accentColor: PINK }}
//             />
//           </label>
//           <span className="text-sm font-bold" style={{ color: PINK }}>{fmt(price.gstPrice)}</span>
//         </div>

//         <hr className="border-t border-gray-100 my-2" />

//         {/* Show Price / Adult label */}
//         <div className="flex items-center gap-2 mb-3">
//           <span className="w-4 h-4 rounded flex-shrink-0" style={{ background: PINK }} />
//           <span className="text-sm font-bold" style={{ color: NAVY }}>Show Price / Adult</span>
//         </div>

//         {/* Final Price */}
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-xs text-gray-500">Final Price / Adult</span>
//           <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price.finalPrice)}</span>
//         </div>

//         {/* Discounted Price */}
//         <div className="flex items-start justify-between">
//           <span className="text-xs text-gray-500">Discounted Price / Adult</span>
//           <div className="text-right">
//             <span className="block text-xs text-gray-400 line-through">{fmt(price.finalPrice)}</span>
//             <span className="block text-sm font-bold" style={{ color: PINK }}>{fmt(price.discountedPrice)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* ── DESKTOP: sticky top bar ── */}
//       <div
//         className="hidden sm:block sticky top-0 z-50 w-full py-2 px-2"
//         style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)" }}
//       >
//         <CardContent />
//       </div>

//       {/* ── MOBILE: floating button + drawer ── */}
//       <div className="sm:hidden">
//         {/* Sticky trigger button */}
//         <div className="sticky top-0 z-50 flex justify-end px-3 py-2"
//           style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(6px)" }}
//         >
//           <button
//             type="button"
//             onClick={() => setMobileOpen(true)}
//             className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
//             style={{ background: NAVY }}
//           >
//             <span>₹</span>
//             <span>Price</span>
//             <span style={{ color: PINK }}>▼</span>
//           </button>
//         </div>

//         {/* Backdrop */}
//         {mobileOpen && (
//           <div
//             className="fixed inset-0 z-40"
//             style={{ background: "rgba(0,0,0,0.4)" }}
//             onClick={() => setMobileOpen(false)}
//           />
//         )}

//         {/* Drawer sliding up from bottom */}
//         <div
//           className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-y-auto transition-transform duration-300"
//           style={{
//             background: "white",
//             maxHeight: "90vh",
//             transform: mobileOpen ? "translateY(0)" : "translateY(100%)",
//             boxShadow: "0 -4px 30px rgba(0,0,0,0.2)",
//           }}
//         >
//           {/* Drawer handle + close */}
//           <div
//             className="flex items-center justify-between px-4 py-3"
//             style={{ borderBottom: "1px solid #f0f0f0" }}
//           >
//             <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
//             <span className="text-sm font-bold" style={{ color: NAVY }}>Price Summary</span>
//             <button
//               type="button"
//               onClick={() => setMobileOpen(false)}
//               className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
//               style={{ fontSize: 18, lineHeight: 1 }}
//             >
//               ×
//             </button>
//           </div>
//           <div className="p-3">
//             <CardContent />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





// import React, { useState } from "react";

// const PINK = "#ED5F8D";
// const NAVY = "#18305C";

// function PriceSection({ price, setPrice, noOfDays = 1 }) {
//     const [isMarginMode, setIsMarginMode] = useState(price.isMargin ?? true);
//     const [actOpen, setActOpen] = useState(false);

//     const update = (fields) => setPrice((prev) => ({ ...prev, ...fields }));

//     const onMarginSlide = (val) => {
//         setIsMarginMode(true);
//         update({ margin: Number(val), isMargin: true });
//     };

//     const onCommissionInput = (val) => {
//         setIsMarginMode(false);
//         update({ commission: Math.max(0, Number(val) || 0), isMargin: false });
//     };

//     const onSurgeInput = (val) => {
//         const v = Math.min(50000, Math.max(0, Number(val) || 0));
//         update({ festivalSurge: v });
//     };

//     const onDiscountInput = (val) => {
//         const v = Math.min(50000, Math.max(0, Number(val) || 0));
//         update({ discount: v });
//     };

//     const fmt = (v) => "₹" + Math.round(v || 0).toLocaleString("en-IN");
//     const fmt2 = (v) =>
//         "₹" +
//         (v || 0).toLocaleString("en-IN", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//         });

//     const nights = Math.max(0, (noOfDays || 1) - 1);

//     return (
//         <div style={s.stickyWrap}>
//             <div style={s.card}>

//                 {/* ── TOP: navy section ── */}
//                 <div style={s.top}>

//                     {/* Show Breakup row */}
//                     <div style={s.breakupRow}>
//                         <label style={s.breakupLabel}>
//                             <input
//                                 type="checkbox"
//                                 checked={price.showBreakUp}
//                                 onChange={(e) => update({ showBreakUp: e.target.checked })}
//                                 style={{ width: 16, height: 16, accentColor: PINK, cursor: "pointer" }}
//                             />
//                             Show Breakup
//                         </label>
//                         <button style={s.editBtn} type="button" aria-label="Edit">✏️</button>
//                     </div>

//                     {/* Trip Duration */}
//                     <div style={{ marginBottom: 4 }}>
//                         <div style={s.lblW}>Trip Duration</div>
//                         <div style={{ ...s.valW, fontSize: 15, marginTop: 2 }}>
//                             {nights} Nights / {noOfDays} Days
//                         </div>
//                     </div>

//                     {/* Base Cost */}
//                     <div style={{ marginBottom: 14 }}>
//                         <div style={{ ...s.valW, fontSize: 13, fontWeight: 500 }}>
//                             Base Cost : {fmt2(price.baseCost)}
//                         </div>
//                     </div>

//                     {/* Margin / Commission toggle */}
//                     <div style={s.radioRow}>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setIsMarginMode(true);
//                                 update({ isMargin: true });
//                             }}
//                             style={{
//                                 ...s.rbtn,
//                                 ...(isMarginMode ? s.rbtnActive : {}),
//                             }}
//                         >
//                             <span style={{
//                                 ...s.dot,
//                                 ...(isMarginMode ? s.dotActive : {}),
//                             }} />
//                             Margin
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setIsMarginMode(false);
//                                 update({ isMargin: false });
//                             }}
//                             style={{
//                                 ...s.rbtn,
//                                 borderLeft: "1px solid rgba(255,255,255,0.15)",
//                                 ...(!isMarginMode ? s.rbtnActive : {}),
//                             }}
//                         >
//                             <span style={{
//                                 ...s.dot,
//                                 ...(!isMarginMode ? s.dotActive : {}),
//                             }} />
//                             Commission
//                         </button>
//                     </div>

//                     {/* Margin slider */}
//                     {isMarginMode && (
//                         <div style={{ marginBottom: 4 }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
//                                 <span style={{ fontSize: 11, color: "#a8bcd4" }}>{price.min_margin}</span>
//                                 <span style={{ fontSize: 11, color: "#a8bcd4" }}>{price.max_margin}</span>
//                             </div>
//                             <input
//                                 type="range"
//                                 min={price.min_margin}
//                                 max={price.max_margin}
//                                 step={1}
//                                 value={price.margin}
//                                 onChange={(e) => onMarginSlide(e.target.value)}
//                                 style={{ width: "100%", accentColor: PINK, cursor: "pointer" }}
//                             />
//                             <div style={{ textAlign: "center", fontSize: 12, color: "#a8bcd4", marginTop: 2 }}>
//                                 {price.margin}
//                             </div>
//                         </div>
//                     )}

//                     {/* Commission input */}
//                     {!isMarginMode && (
//                         <input
//                             type="number"
//                             min={0}
//                             placeholder="Commission Amount"
//                             value={price.commission || ""}
//                             onChange={(e) => onCommissionInput(e.target.value)}
//                             style={s.commInput}
//                         />
//                     )}
//                 </div>

//                 {/* ── BOTTOM: white section ── */}
//                 <div style={s.bot}>

//                     {/* Additional Activities */}
//                     <div
//                         style={s.actRow}
//                         onClick={() => setActOpen((p) => !p)}
//                         role="button"
//                         tabIndex={0}
//                         onKeyDown={(e) => e.key === "Enter" && setActOpen((p) => !p)}
//                     >
//                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <span style={s.actLabel}>Additional Activities</span>
//                             <span style={s.actVal}>{fmt(price.additionalActivities)}</span>
//                         </div>
//                         <span style={{ fontSize: 14, color: NAVY, transform: actOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
//                             ⌄
//                         </span>
//                     </div>

//                     <div style={s.divider} />

//                     {/* Total Cost */}
//                     <div style={{ ...s.botRow, marginBottom: 14 }}>
//                         <span style={s.botLbl}>Total Cost</span>
//                         <span style={s.botVal}>{fmt(price.totalCost)}</span>
//                     </div>

//                     {/* Festival Surge */}
//                     <div style={s.surgeRow}>
//                         <span style={{ ...s.dot2, background: "#555" }} />
//                         <span style={s.surgeLbl}>Festival Surge</span>
//                         <input
//                             type="number"
//                             min={0}
//                             max={50000}
//                             value={price.festivalSurge || ""}
//                             onChange={(e) => onSurgeInput(e.target.value)}
//                             style={s.numInput}
//                         />
//                     </div>
//                     <div style={{ marginBottom: 10 }}>
//                         <input
//                             type="range"
//                             min={0}
//                             max={50000}
//                             step={500}
//                             value={price.festivalSurge || 0}
//                             onChange={(e) => onSurgeInput(e.target.value)}
//                             style={{ width: "100%", accentColor: "#555", cursor: "pointer" }}
//                         />
//                     </div>

//                     {/* Discount */}
//                     <div style={s.surgeRow}>
//                         <span style={{ ...s.dot2, background: "#22c55e" }} />
//                         <span style={s.surgeLbl}>Discount</span>
//                         <input
//                             type="number"
//                             min={0}
//                             max={50000}
//                             value={price.discount || ""}
//                             onChange={(e) => onDiscountInput(e.target.value)}
//                             style={s.numInput}
//                         />
//                     </div>
//                     <div style={{ marginBottom: 10 }}>
//                         <input
//                             type="range"
//                             min={0}
//                             max={50000}
//                             step={500}
//                             value={price.discount || 0}
//                             onChange={(e) => onDiscountInput(e.target.value)}
//                             style={{ width: "100%", accentColor: "#22c55e", cursor: "pointer" }}
//                         />
//                     </div>

//                     <div style={s.divider} />

//                     {/* GST */}
//                     <div style={s.botRow}>
//                         <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
//                             <span style={{ width: 16, height: 16, background: "#FBEAF0", borderRadius: 3, flexShrink: 0 }} />
//                             <span style={{ fontSize: 12, color: "#555" }}>GST @5%</span>
//                             <input
//                                 type="checkbox"
//                                 checked={price.isGstChecked}
//                                 onChange={(e) => update({ isGstChecked: e.target.checked })}
//                                 style={{ accentColor: PINK, width: 14, height: 14, cursor: "pointer", marginLeft: 4 }}
//                             />
//                         </label>
//                         <span style={{ fontSize: 13, fontWeight: 700, color: PINK }}>{fmt(price.gstPrice)}</span>
//                     </div>

//                     <div style={s.divider} />

//                     {/* Show Price / Adult label */}
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
//                         <span style={{ width: 16, height: 16, background: PINK, borderRadius: 3, flexShrink: 0 }} />
//                         <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Show Price / Adult</span>
//                     </div>

//                     {/* Final Price */}
//                     <div style={s.botRow}>
//                         <span style={s.botLbl}>Final Price / Adult</span>
//                         <span style={s.botVal}>{fmt(price.finalPrice)}</span>
//                     </div>

//                     {/* Discounted Price */}
//                     <div style={{ ...s.botRow, alignItems: "flex-start" }}>
//                         <span style={s.botLbl}>Discounted Price / Adult</span>
//                         <div style={{ textAlign: "right" }}>
//                             <span style={{ fontSize: 12, color: "#aaa", textDecoration: "line-through", display: "block" }}>
//                                 {fmt(price.finalPrice)}
//                             </span>
//                             <span style={{ fontSize: 13, fontWeight: 700, color: PINK }}>
//                                 {fmt(price.discountedPrice)}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// const s = {
//     stickyWrap: {
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         width: "100%",
//         marginBottom: 16,
//     },
//     card: {
//         borderRadius: 16,
//         overflow: "hidden",
//         border: `2px solid ${NAVY}`,
//         width: "100%",
//         maxWidth: 420,
//         margin: "0 auto",
//         boxShadow: "0 4px 20px rgba(24,48,92,0.15)",
//     },
//     top: {
//         background: NAVY,
//         padding: "16px 18px",
//     },
//     bot: {
//         background: "#fff",
//         padding: "14px 18px",
//     },
//     breakupRow: {
//         display: "flex", alignItems: "center",
//         justifyContent: "space-between", marginBottom: 14,
//     },
//     breakupLabel: {
//         display: "flex", alignItems: "center", gap: 8,
//         fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
//     },
//     editBtn: {
//         background: "none", border: "none",
//         color: "#a8bcd4", cursor: "pointer", fontSize: 16, padding: 0,
//     },
//     lblW: { fontSize: 12, color: "#a8bcd4" },
//     valW: { fontSize: 13, fontWeight: 600, color: "#fff" },
//     radioRow: {
//         display: "flex", border: "1px solid rgba(255,255,255,0.2)",
//         borderRadius: 8, overflow: "hidden", marginBottom: 12,
//     },
//     rbtn: {
//         flex: 1, padding: "7px 10px", fontSize: 12, fontWeight: 600,
//         color: "#a8bcd4", background: "transparent", border: "none",
//         cursor: "pointer", display: "flex", alignItems: "center",
//         gap: 6, justifyContent: "center", transition: "all 0.15s",
//     },
//     rbtnActive: { background: "rgba(255,255,255,0.12)", color: "#fff" },
//     dot: {
//         width: 10, height: 10, borderRadius: "50%",
//         border: "2px solid #a8bcd4", flexShrink: 0,
//     },
//     dotActive: { borderColor: PINK, background: PINK },
//     commInput: {
//         width: "100%", background: "rgba(255,255,255,0.1)",
//         border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8,
//         padding: "7px 10px", color: "#fff", fontSize: 13, outline: "none",
//     },
//     divider: {
//         border: "none", borderTop: "1px solid #f0f0f0", margin: "10px 0",
//     },
//     actRow: {
//         display: "flex", alignItems: "center",
//         justifyContent: "space-between", cursor: "pointer", marginBottom: 8,
//     },
//     actLabel: { fontSize: 13, fontWeight: 700, color: NAVY },
//     actVal:   { fontSize: 13, fontWeight: 700, color: NAVY },
//     botRow: {
//         display: "flex", alignItems: "center",
//         justifyContent: "space-between", marginBottom: 8,
//     },
//     botLbl: { fontSize: 12, color: "#888" },
//     botVal: { fontSize: 13, fontWeight: 600, color: NAVY },
//     surgeRow: {
//         display: "flex", alignItems: "center",
//         gap: 8, marginBottom: 4,
//     },
//     dot2: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
//     surgeLbl: { fontSize: 12, color: "#555", flex: 1 },
//     numInput: {
//         width: 90, border: "1px solid #e0e0e0", borderRadius: 8,
//         padding: "5px 8px", fontSize: 12, color: NAVY,
//         fontWeight: 600, textAlign: "right", outline: "none",
//     },
// };

// export default PriceSection;