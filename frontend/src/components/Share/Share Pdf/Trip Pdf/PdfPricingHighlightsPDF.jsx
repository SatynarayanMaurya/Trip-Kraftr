// components/Pdf/PdfSections/PdfPricingHighlightsPdf.jsx

import React from "react";
import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import PdfImagePdf from "./PdfImagePdf";
import { RupeeIcon } from "./Icons";
const PINK = "#ED5F8D";
const NAVY = "#08255B";
const BLUE = "#9CBFFF57";

const styles = StyleSheet.create({
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },

    rupeeIcon: {
        width: 12,
        height: 12,
        marginRight: 3,
    },

    price: {
        color: PINK,
        fontSize: 16,
        fontWeight: "bold",
    },
    section: {
        marginTop: 20,
    },

    title: {
        fontSize: 12,
        fontWeight: "bold",
        color: NAVY,
        marginBottom: 8,
    },

    priceBox: {
        backgroundColor: NAVY,
        padding: 10,
        borderRadius: 8,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },

    label: {
        fontSize: 10,
        color: "#CBD5E1",
    },

    value: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "bold",
    },

    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginVertical: 6,
    },

    finalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },

    finalLabel: {
        fontSize: 11,
        fontWeight: "bold",
        color: PINK,
    },

    finalValue: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#fff",
    },

    highlightCard: {
        flexDirection: "row",
        gap: 6,
        backgroundColor: BLUE,
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
    },

    image: {
        width: 120,
        height: 80,
        marginRight: 10,
        objectFit: "cover",
        borderRadius: 4,
    },

    activityName: {
        fontSize: 10,
        fontWeight: "bold",
        color: NAVY,
        marginBottom: 4,
    },

    notes: {
        fontSize: 9,
        color: "#6B7280",
    },

    emptyText: {
        fontSize: 10,
        color: "#9CA3AF",
    },
});

function PdfPricingHighlightsPdf({ price, activities = [], tripType, tripDetails = {} }) {
    const rowsPrivateTrip = [
        { label: "Base Cost", value: price?.baseCost },
        { label: "Additional Activities", value: price?.additionalActivities },
        { label: "Festival Surge", value: price?.festivalSurge },
        { label: "Discount", value: price?.discount ? `- ${price.discount}` : 0, },
        price?.isGstChecked ? { label: "GST", value: price?.gstPrice } : null,
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

    console.log("trip Type : ",tripType)
    const rows = rowsMap[rowsPrivateTrip] || [];

    const fmt = (v) => `INR ${Number(v || 0).toLocaleString("en-IN")}`;

    return (
        <View style={styles.section}>

            {/* PRICING */}
            <Text style={styles.title}>Pricing Details</Text>

            <View style={styles.priceBox}>

                {rowsPrivateTrip?.map((r, i) => (
                    <View key={i} style={styles.row}>
                        <Text style={styles.label}>{r.label}</Text>
                        <View style={styles.priceRow}>
                            <RupeeIcon size={10} color={"#fff"} />
                            <Text style={styles.value}>{r.value}</Text>
                        </View>
                    </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.finalRow}>
                    <Text style={styles.finalLabel}>Final Price</Text>
                    <View style={styles.priceRow}>
                        <RupeeIcon size={14} color={PINK} />
                        <Text style={styles.price}>{price?.finalPrice}</Text>
                    </View>
                </View>

            </View>

            {/* HIGHLIGHTS */}
            <Text style={[styles.title, { marginTop: 15 }]}>
                Trip Highlights
            </Text>

            {activities.length === 0 ? (
                <Text style={styles.emptyText}>
                    No activities added yet.
                </Text>
            ) : (
                activities.map((a, i) => (
                    <View key={i} style={styles.highlightCard}>

                        {/* IMAGE */}
                        <PdfImagePdf src={a?.image} style={{ width: 200, height: 100 }} />

                        {/* TEXT */}
                        <View style={{ flex: 1 }}>

                            <Text style={styles.activityName}>
                                {a?.name}{" "}
                                {a?.isComplimentary ? "(Complimentary)" : ""}
                            </Text>

                            <Text style={styles.notes}>
                                {a?.description || a?.notes || "No description available."}
                            </Text>

                        </View>

                    </View>
                ))
            )}

        </View>
    );
}

export default PdfPricingHighlightsPdf;