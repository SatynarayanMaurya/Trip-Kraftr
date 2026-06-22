

import React, { useState } from "react";

const PINK = "#ED5F8D";
const NAVY = "#18305C";

export default function PriceSection({ price, noOfDays = 1, setPrice = () => { }, isEditable = true }) {
    const [isMarginMode, setIsMarginMode] = useState(price?.isMargin ?? true);
    const [actOpen, setActOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // const update = (fields) => setPrice((prev) => ({ ...prev, ...fields }));
    const update = (fields) => {
        if (!isEditable) return;

        setPrice((prev) => ({
            ...prev,
            ...fields,
        }));
    };

    const onMarginSlide = (val) => { setIsMarginMode(true); update({ margin: Number(val), isMargin: true }); };
    const onCommissionInput = (val) => { setIsMarginMode(false); update({ commission: Math.max(0, Number(val) || 0), isMargin: false }); };
    const onSurgeInput = (val) => update({ festivalSurge: Math.min(50000, Math.max(0, Number(val) || 0)) });
    const onDiscountInput = (val) => update({ discount: Math.min(50000, Math.max(0, Number(val) || 0)) });

    const fmt = (v) => "₹" + Math.round(v || 0).toLocaleString("en-IN");
    const fmt2 = (v) => "₹" + (v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const nights = Math.max(0, (noOfDays || 1) - 1);

    // Plain JSX variable (not a nested component) so it doesn't remount on every render
    const cardJSX = (
        <div
            className="rounded-2xl overflow-hidden w-full"
            style={{ maxWidth: 340, border: `2px solid ${NAVY}`, boxShadow: "0 4px 24px rgba(24,48,92,0.18)" }}
        >
            {/* ── NAVY TOP ── */}
            <div className="px-4 py-4" style={{ background: NAVY }}>

                {/* Show Breakup */}
                <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-white text-sm font-semibold cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={price?.showBreakUp}
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
                <div className="text-xs font-medium text-white mb-3">Base Cost : {fmt2(price?.baseCost)}</div>

                {/* Margin / Commission toggle */}
                <div className="flex rounded-lg overflow-hidden mb-3" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                    {[
                        { label: "Margin", active: price?.isMargin, onClick: () => { setIsMarginMode(true); update({ isMargin: true }); } },
                        { label: "Commission", active: !price?.isMargin, onClick: () => { setIsMarginMode(false); update({ isMargin: false }); } },
                    ].map(({ label, active, onClick }, i) => (
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
                            <span
                                className="w-2.5 h-2.5 rounded-full border-2 shrink-0"
                                style={{ borderColor: active ? PINK : "#a8bcd4", background: active ? PINK : "transparent" }}
                            />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Margin slider */}
                {price?.isMargin && (
                    <div className="mb-1">
                        <div className="flex justify-between mb-0.5">
                            <span className="text-xs" style={{ color: "#a8bcd4" }}>0</span>
                            <span className="text-xs" style={{ color: "#a8bcd4" }}>{price?.max_margin - price?.min_margin}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={price?.max_margin - price?.min_margin}
                            step={1}
                            value={price?.margin - price?.min_margin}
                            onChange={(e) => onMarginSlide(price?.min_margin + Number(e.target.value))}
                            className="w-full cursor-pointer"
                            style={{ accentColor: PINK }}
                        />
                        <div className="text-center text-xs mt-0.5" style={{ color: "#a8bcd4" }}>
                            {price?.margin - price?.min_margin}
                        </div>
                    </div>
                )}

                {/* Commission input */}
                {!price?.isMargin && (
                    <input
                        type="number"
                        min={0}
                        placeholder="Commission Amount"
                        value={price?.commission || ""}
                        onChange={(e) => onCommissionInput(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                    />
                )}
            </div>

            {/* ── WHITE BOTTOM ── */}
            <div className="px-4 py-3 bg-white">

                {/* Additional Activities */}
                <div
                    className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => setActOpen(p => !p)}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActOpen(p => !p)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: NAVY }}>Additional Activities</span>
                        <span className="text-sm font-bold" style={{ color: NAVY }}>{fmt(price?.additionalActivities)}</span>
                    </div>
                    <span
                        className="text-sm transition-transform duration-200"
                        style={{ color: NAVY, display: "inline-block", transform: actOpen ? "rotate(180deg)" : "none" }}
                    >⌄</span>
                </div>

                <hr className="border-t border-gray-100 my-2" />

                {/* Total Cost */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Total Cost</span>
                    <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price?.totalCost)}</span>
                </div>

                {/* Festival Surge */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#555" }} />
                    <span className="text-xs text-gray-500 flex-1">Festival Surge</span>
                    <input
                        type="number" min={0} max={50000}
                        value={price?.festivalSurge || ""}
                        onChange={(e) => onSurgeInput(e.target.value)}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
                        style={{ color: NAVY }}
                    />
                </div>
                <div className="mb-2.5">
                    <input
                        type="range" min={0} max={50000} step={500}
                        value={price?.festivalSurge || 0}
                        onChange={(e) => onSurgeInput(e.target.value)}
                        className="w-full cursor-pointer"
                        style={{ accentColor: "#555" }}
                    />
                </div>

                {/* Discount */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#22c55e" }} />
                    <span className="text-xs text-gray-500 flex-1">Discount</span>
                    <input
                        type="number" min={0} max={50000}
                        value={price?.discount || ""}
                        onChange={(e) => onDiscountInput(e.target.value)}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-right outline-none"
                        style={{ color: NAVY }}
                    />
                </div>
                <div className="mb-2.5">
                    <input
                        type="range" min={0} max={50000} step={500}
                        value={price?.discount || 0}
                        onChange={(e) => onDiscountInput(e.target.value)}
                        className="w-full cursor-pointer"
                        style={{ accentColor: "#22c55e" }}
                    />
                </div>

                <hr className="border-t border-gray-100 my-2" />

                {/* GST */}
                <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="w-4 h-4 rounded shrink-0" style={{ background: "#FBEAF0" }} />
                        <span className="text-xs text-gray-500">GST @5%</span>
                        <input
                            type="checkbox"
                            checked={price?.isGstChecked}
                            onChange={(e) => update({ isGstChecked: e.target.checked })}
                            className="w-3.5 h-3.5 cursor-pointer ml-1"
                            style={{ accentColor: PINK }}
                        />
                    </label>
                    <span className="text-sm font-bold" style={{ color: PINK }}>{fmt(price?.gstPrice)}</span>
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
                    <span className="text-sm font-semibold" style={{ color: NAVY }}>{fmt(price?.finalPrice)}</span>
                </div>

                {/* Discounted Price */}
                <div className="flex items-start justify-between">
                    <span className="text-xs text-gray-500">Discounted Price / Adult</span>
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 line-through">{fmt(price?.finalPrice)}</span>
                        <span className="block text-sm font-bold" style={{ color: PINK }}>{fmt(price?.discountedPrice)}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ══ DESKTOP / TABLET: sticky card, no scroll of its own ══ */}
            <div className="hidden sm:block " style={{ position: 'sticky', top: '20px', flexShrink: 0, alignSelf: 'flex-start', width: '20vw', }}>
                {cardJSX}
            </div>

            {/* ══ MOBILE: sticky pill button + bottom drawer ══ */}
            <div className="sm:hidden">
                {/* Floating Price button */}
                <div className="fixed top-3 right-3 z-50">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
                        style={{ background: NAVY }}
                    >
                        <span style={{ color: PINK }}>₹</span>
                        <span>Price</span>
                        <span style={{ color: PINK, fontSize: 10 }}>▲</span>
                    </button>
                </div>

                {/* Backdrop */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        style={{ background: "rgba(0,0,0,0.45)" }}
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                {/* Bottom drawer */}
                <div
                    className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl transition-transform duration-300 ease-out"
                    style={{
                        maxHeight: "92vh",
                        transform: mobileOpen ? "translateY(0)" : "translateY(100%)",
                        boxShadow: "0 -6px 30px rgba(0,0,0,0.2)",
                        background: "white",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 pt-3 pb-2 relative"
                        style={{ borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}
                    >
                        <div className="w-10 h-1 rounded-full bg-gray-300 absolute left-1/2 -translate-x-1/2 top-2" />
                        <span className="text-sm font-bold" style={{ color: NAVY }}>Price Summary</span>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-xl leading-none"
                        >×</button>
                    </div>

                    {/* Scrollable body */}
                    <div
                        className="p-3"
                        style={{ overflowY: "auto", flex: 1, minHeight: 0 }}
                    >
                        <div style={{ maxWidth: 340, margin: "0 auto" }}>
                            {cardJSX}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


