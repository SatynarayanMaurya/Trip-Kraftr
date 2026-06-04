

import React from "react";
import { inputStyle, labelStyle } from "../../Common/CommonCss";

const PINK = "#ED5F8D";
const BLUE = "#18305C";

function RegionDetailsSamplePackage({
    formData,
    regions,
    handleChange,
    handleSave,
    getFilteredRegions,
}) {


    return (
        <div
            style={{
                background: "white",
                borderRadius: "10px",
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
                        Region <span style={{ color: PINK }}>*</span>
                    </label>
                    <select
                        style={inputStyle}
                        value={formData.region1 || ''}
                        onChange={(e) => handleChange("region1", e.target.value)}
                    >
                        <option value="">Select Region</option>
                        {getFilteredRegions(["region2", "region3"]).map((r) => (
                            <option key={r._id} value={r._id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Region 2 */}
                <div>
                    <label style={labelStyle}>Region 2</label>
                    <select
                        style={{ ...inputStyle, backgroundColor: !formData?.region1 ? "#f0f0f0" : undefined, }}
                        value={formData.region2 || ''}
                        disabled={!formData?.region1}
                        onChange={(e) => handleChange("region2", e.target.value)}
                    >
                        <option value="">Select Region</option>
                        {getFilteredRegions(["region1", "region3"]).map((r) => (
                            <option key={r._id} value={r._id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Region 3 */}
                <div>
                    <label style={labelStyle}>Region 3</label>
                    <select
                        style={{ ...inputStyle, backgroundColor: !formData?.region2 ? "#f0f0f0" : undefined }}
                        value={formData.region3 || ''}
                        disabled={!formData?.region2}
                        onChange={(e) => handleChange("region3", e.target.value)}
                    >
                        <option value="">Select Region</option>
                        {getFilteredRegions(["region1", "region2"]).map((r) => (
                            <option key={r._id} value={r._id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* No of Days */}
                <div>
                    <label style={labelStyle}>No. of days <span style={{ color: PINK }}>*</span></label>
                    <input
                        type="number"
                        placeholder="No of Days"
                        style={{
                            ...inputStyle,
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        value={formData.noOfDays || ''}
                        onChange={(e) => handleChange("noOfDays", Number(e.target.value))}
                    />
                </div>

                {/* Start Date */}
                <div>
                    <label style={labelStyle}>
                        Start Date <span style={{ color: PINK }}>*</span>
                    </label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={formData.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
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
                        placeholder="Enter Number of Adults"
                        style={inputStyle}
                        value={formData.adults||''}
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
                        placeholder="Enter Number of children"
                        style={inputStyle}
                        value={formData.children || ""}
                        onChange={(e) => {
                            const count = Number(e.target.value);

                            handleChange("children", count);

                            // Create empty age array
                            handleChange(
                                "childAges",
                                Array(count).fill("")
                            );
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
                            gap: "2rem",
                            marginTop: "30px",
                          }}
                    >
                        {formData?.childAges.map((age, index) => (
                            <div key={index}>
                                <label style={labelStyle}>
                                    Child Age {index + 1}
                                </label>

                                {/* <input
                                    type="number"
                                    min="0"
                                    max="17"
                                    placeholder="Age"
                                    style={{
                                        ...inputStyle,
                                        width: "70px",
                                        minWidth: "70px",
                                        padding: "8px",
                                        textAlign: "center",
                                      }}
                                    value={age}
                                    onChange={(e) => {
                                        const updatedAges = [...formData.childAges];

                                        updatedAges[index] = Number(e.target.value);

                                        handleChange("childAges", updatedAges);
                                    }}
                                    onWheel={(e) => e.currentTarget.blur()}
                                /> */}
                                <select name="childAge" id="childAge"
                                style={{
                                    ...inputStyle,
                                    width: "70px",
                                    minWidth: "100px",
                                    padding: "8px",
                                    textAlign: "center",
                                  }}
                                value={age}
                                onChange={(e) => {
                                    const updatedAges = [...formData.childAges];

                                    updatedAges[index] = Number(e.target.value);

                                    handleChange("childAges", updatedAges);
                                }}
                                >
                                    <option value={""}>Child age</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                    <option value={8}>8</option>
                                    <option value={9}>9</option>
                                    <option value={10}>10</option>
                                    <option value={11}>11</option>
                                    <option value={12}>12</option>
                                </select>
                            </div>
                        ))}
                    </div>
                )}


            {/* Save Button */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "24px",
                    flexWrap: "wrap",
                }}
            >
                <button
                    onClick={handleSave}
                    style={{
                        background: PINK,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 28px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: "pointer",
                        width: "100%",
                        maxWidth: "200px",
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
export default RegionDetailsSamplePackage