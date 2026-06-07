import React from "react";

const BLUE = "#18305C";
const PINK = "#ED5F8D";

function CustomerDetails({ enquiryDetails, enquiryType }) {
    const account = enquiryDetails?.accountId || {};

    return (
        <div>
            {/* Section Header */}
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
                    Customer Details
                </span>
            </div>

            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px 24px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    marginBottom: "16px",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "16px",
                    }}
                >
                    {/* Customer Name + badge */}
                    <div>
                        <label style={labelStyle}>
                            Customer Name <span style={{ color: PINK }}>*</span>
                            {enquiryType && (
                                <span
                                    style={{
                                        marginLeft: "8px",
                                        fontSize: "11px",
                                        fontWeight: "500",
                                        padding: "2px 10px",
                                        borderRadius: "99px",
                                        background: enquiryType === "b2b" ? "#FBEAF0" : "#E6F1FB",
                                        color: enquiryType === "b2b" ? "#993556" : "#185FA5",
                                    }}
                                >
                                    {enquiryType.toUpperCase()}
                                </span>
                            )}
                        </label>
                        <input
                            style={readOnlyInputStyle}
                            type="text"
                            readOnly
                            value={account?.fullName||account?.businessName || ""}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={labelStyle}>
                            Email Id <span style={{ color: PINK }}>*</span>
                        </label>
                        <input
                            style={readOnlyInputStyle}
                            type="text"
                            readOnly
                            value={account.email || ""}
                        />
                    </div>

                    {/* Contact */}
                    <div>
                        <label style={labelStyle}>
                            Contact no <span style={{ color: PINK }}>*</span>
                        </label>
                        <input
                            style={readOnlyInputStyle}
                            type="text"
                            readOnly
                            value={account.phone || ""}
                        />
                    </div>

                    {/* Source */}
                    <div>
                        <label style={labelStyle}>Source</label>
                        <input
                            style={readOnlyInputStyle}
                            type="text"
                            readOnly
                            value={account?.source || ""}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "500",
    color: "#555",
    marginBottom: "5px",
};

const readOnlyInputStyle = {
    width: "100%",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13px",
    color: "#444",
    background: "#f8f8f8",
    outline: "none",
    cursor: "default",
};

export default CustomerDetails;