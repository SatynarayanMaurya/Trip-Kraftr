import React, { useState } from "react";

function CalculationCard({ price, handlePrice, vendorDetails, handleVendorDetails }) {
    const [vendorName, setVendorName] = useState("ABC Vendor");
    const [vendorPrice, setVendorPrice] = useState(15000);
    const [commission, setCommission] = useState(10);


    const commissionAmount =
        (Number(vendorPrice) * Number(commission)) / 100;


    return (
        <div className="flex flex-col justify-between lg:flex-row gap-4">

            {/* ================= Vendor Card ================= */}
            <div className="w-[380px] bg-[#102B63] text-white rounded-2xl shadow-lg p-4">

                <h2 className="text-sm font-semibold border-b border-white/20 pb-2">
                    Vendor Details
                </h2>

                <div className="space-y-3 mt-4">


                    {/* Vendor Name */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Name</span>

                        <input
                            type="text"
                            name="vendorName"
                            placeholder="Vendor Name"
                            value={vendorDetails?.vendorName||''}
                            onChange={(e) => handleVendorDetails(e)}
                            className="w-[70%] mt-1 bg-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                        />
                    </div>

                    {/* Vendor Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Vendor Price</span>

                        <input
                            type="number"
                            name="vendorPrice"
                            placeholder="0"
                            value={vendorDetails?.vendorPrice||''}
                            onChange={(e) => handleVendorDetails(e)}
                            className="w-28 bg-white/10 rounded-lg px-2 py-1 text-sm text-right outline-none"
                        />
                    </div>

                    {/* Commission */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Commission</span>

                        <input
                            type="number"
                            name="commission"
                            placeholder="0"
                            value={vendorDetails?.commission||''}
                            onChange={(e) => handleVendorDetails(e)}
                            className="w-28 bg-white/10 rounded-lg px-2 py-1 text-sm text-right outline-none"
                        />
                    </div>

                </div>
            </div>

            {/* ================= Price Card ================= */}
            <div className="w-[380px] bg-[#102B63] text-white rounded-2xl shadow-lg p-4 h-fit">

                <h2 className="text-sm font-semibold border-b border-white/20 pb-2">
                    Final Calculation
                </h2>

                <div className="space-y-3 mt-4">

                    {/* Total Price */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Total Price</span>

                        <input
                            type="number"
                            value={price?.totalPrice}
                            readOnly
                            className="w-[60%] bg-white/10 rounded-lg px-2 py-1 text-sm text-right outline-none"
                        />
                    </div>

                    {/* Additional Price */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Additional Price</span>

                        <input
                            name="additionalPrice"
                            placeholder="Additional Price"
                            type="number"
                            value={price?.additionalPrice || ''}
                            onChange={(e) => handlePrice(e)}
                            className="w-[60%] bg-white/10 rounded-lg px-2 py-1 text-sm text-right outline-none"
                        />
                    </div>

                    {/* GST */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isGstChecked"
                                checked={price?.isGstChecked}
                                onChange={(e) => handlePrice(e)}
                                className="w-4 h-4"
                            />

                            <span className="text-sm">GST {' 5 %'}</span>

                        </div>

                        <span className="text-pink-400 text-sm font-medium">
                            {price?.isGstChecked && '+'} ₹ {price?.gstPrice?.toFixed(0)}
                        </span>
                    </div>

                    {/* Final Price */}
                    <div className="border-t border-dashed border-white/20 pt-3 flex justify-between items-center">
                        <span className="font-semibold">
                            Final Price
                        </span>

                        <span className="text-lg font-bold">
                            ₹{price?.finalPrice?.toFixed(0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalculationCard;