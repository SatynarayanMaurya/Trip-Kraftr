

import React from "react";
import { inputStyle, labelStyle } from "../../Common/CommonCss";

const PINK = "#ED5F8D";
const BLUE = "#18305C";

function RegionDetails({
  formData,
  regions,
  numDays,
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
            value={formData.region1}
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
            style={inputStyle}
            value={formData.region2}
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
            style={inputStyle}
            value={formData.region3}
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

        {/* From Date */}
        <div>
          <label style={labelStyle}>
            From <span style={{ color: PINK }}>*</span>
          </label>
          <input
            type="date"
            style={inputStyle}
            value={formData.fromDate}
            onChange={(e) => handleChange("fromDate", e.target.value)}
          />
        </div>

        {/* To Date */}
        <div>
          <label style={labelStyle}>
            To <span style={{ color: PINK }}>*</span>
          </label>
          <input
            type="date"
            style={inputStyle}
            value={formData.toDate}
            min={formData.fromDate}
            onChange={(e) => handleChange("toDate", e.target.value)}
          />
        </div>

        {/* No of Days */}
        <div>
          <label style={labelStyle}>No. of days</label>
          <input
            type="number"
            style={{
              ...inputStyle,
              background: "#f0f0f0",
              color: "#888",
              cursor: "not-allowed",
            }}
            value={numDays}
            disabled
          />
        </div>
      </div>

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

export default RegionDetails;