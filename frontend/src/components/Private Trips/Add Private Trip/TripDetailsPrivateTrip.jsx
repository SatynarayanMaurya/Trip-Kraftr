import React from "react";
import { inputStyle, labelStyle } from "../../Common/CommonCss";
import CustomerDetails from "./CustomerDetails";
import { useRef } from "react";

const PINK = "#ED5F8D";
const BLUE = "#18305C";

function TripDetailsPrivateTrip({
    formData,
    customerNotes,
    setFormData,
    customerDetails,
    enquiryDetails,
    enquiryType,          // pass from parent: searchEnquiry.enquiryType
    regions,
    handleChange,
    handleSave,
    getFilteredRegions,
}) {

    console.log("form data : ",formData)
    const dateRef = useRef(null);
    return (
        <div>
            {/* ── Customer Details (read-only) ── */}
            <CustomerDetails
                enquiryDetails={enquiryDetails}
                enquiryType={enquiryType}
            />

            {/* ── Travel Details header ── */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <span
                    style={{
                        background: BLUE,
                        color: "white",
                        borderRadius: "99px",
                        padding: "8px 28px",
                        fontSize: "14px",
                        fontWeight: "500",
                    }}
                >
                    Travel Details
                </span>
            </div>

            {/* ── Travel Details form ── */}
            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {/* Region 1 */}
                    <div>
                        <label style={labelStyle}>
                            Region 1 <span style={{ color: PINK }}>*</span>
                        </label>
                        <select
                            style={inputStyle}
                            value={formData.region1 || ""}
                            onChange={(e) => handleChange("region1", e.target.value)}
                        >
                            <option value="">Select Region</option>
                            {getFilteredRegions(["region2", "region3"]).map((r) => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Region 2 */}
                    <div>
                        <label style={labelStyle}>Region 2</label>
                        <select
                            style={{
                                ...inputStyle,
                                backgroundColor: !formData?.region1 ? "#f0f0f0" : undefined,
                            }}
                            value={formData.region2 || ""}
                            disabled={!formData?.region1}
                            onChange={(e) => handleChange("region2", e.target.value)}
                        >
                            <option value="">Select Region</option>
                            {getFilteredRegions(["region1", "region3"]).map((r) => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Region 3 */}
                    <div>
                        <label style={labelStyle}>Region 3</label>
                        <select
                            style={{
                                ...inputStyle,
                                backgroundColor: !formData?.region2 ? "#f0f0f0" : undefined,
                            }}
                            value={formData.region3 || ""}
                            disabled={!formData?.region2}
                            onChange={(e) => handleChange("region3", e.target.value)}
                        >
                            <option value="">Select Region</option>
                            {getFilteredRegions(["region1", "region2"]).map((r) => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* No of Days */}
                    <div>
                        <label style={labelStyle}>
                            No. of Days <span style={{ color: PINK }}>*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="No of Days"
                            style={inputStyle}
                            onWheel={(e) => e.currentTarget.blur()}
                            value={formData.noOfDays || ""}
                            onChange={(e) => handleChange("noOfDays", Number(e.target.value))}
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label style={labelStyle}>
                            Start Date <span style={{ color: PINK }}>*</span>
                        </label>
                        <input

                            ref={dateRef}
                            onClick={() => dateRef.current?.showPicker()}
                            type="date"
                            style={inputStyle}
                            value={formData.startDate || ""}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label style={labelStyle}>
                            Category 
                        </label>
                        <input

                            readOnly
                            type="text"
                            style={inputStyle}
                            value={enquiryDetails?.hotelCategory || "Not Decided Yet"}
                        />
                    </div>

                    {/* Adults */}
                    <div>
                        <label style={labelStyle}>
                            Adults <span style={{ color: PINK }}>*</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Number of Adults"
                            style={inputStyle}
                            value={formData.adults || ""}
                            onChange={(e) => handleChange("adults", Number(e.target.value))}
                        />
                    </div>

                    {/* Children */}
                    <div>
                        <label style={labelStyle}>Children</label>
                        <input
                            type="number"
                            min={0}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Number of Children"
                            style={inputStyle}
                            value={formData.children || ""}
                            onChange={(e) => {
                                const count = Number(e.target.value);
                                handleChange("children", count);
                                handleChange("childAges", Array(count).fill(""));
                            }}
                        />
                    </div>
                </div>

                {/* Child Ages */}
                {formData.children > 0 && (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginTop: "20px",
                        }}
                    >
                        {formData.childAges.map((age, index) => (
                            <div key={index}>
                                <label style={labelStyle}>
                                    Child Age {index + 1} <span style={{ color: PINK }}>*</span>
                                </label>
                                <select
                                    style={{ ...inputStyle, width: "100px", textAlign: "center" }}
                                    value={age}
                                    onChange={(e) => {
                                        const updatedAges = [...formData.childAges];
                                        updatedAges[index] = Number(e.target.value);
                                        handleChange("childAges", updatedAges);
                                    }}
                                >
                                    <option value="">Age</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                )}


                <div className="flex-1 flex flex-col gap-2 mt-4">
                    <label
                        htmlFor="customerNotes"
                         style={labelStyle}
                    >
                        Customer Notes
                    </label>

                    <textarea
                        value={customerNotes}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                customerNotes: e.target.value
                            }))
                        }}
                        id="customerNotes"
                        name="customerNotes"
                        rows={4}
                        placeholder="Add customer notes..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800
                                    outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                    resize-none"
                    />
                </div>

                {/* Save Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                    <button
                        onClick={handleSave}
                        style={{
                            background: PINK,
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 32px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            width: "100%",
                            maxWidth: "200px",
                        }}
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TripDetailsPrivateTrip;