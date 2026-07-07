// components/Pdf/PdfSections/PdfPricingHighlightsPdf.jsx

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
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

function PdfPricingHighlightsPdf({ price, activities = [], tripType = "privateTrip", tripDetails = {} }) {

    const allActivities = tripDetails?.itineraryBuilder?.daysDetails?.flatMap(day =>
        day.activities?.filter(activity => activity.activityName?.trim()) || []
    ) || [];

    const rowsPrivateTrip = [
        { label: "Total Package Cost", value: price?.finalPrice, show: true, highlight: false },
        { label: "Additional Activities", value: price?.additionalActivities, show: true, highlight: false },
        { label: "+ GST (5%)", value: price?.gstPrice, show: price?.isGstChecked, highlight: false },
        { label: "Discount Applied", value: price?.discount, show: price?.discount > 0, highlight: false },
        { label: "Festival Surge", value: price?.festivalSurge, show: price?.festivalSurge > 0, highlight: false },
        ...allActivities.map((activity) => ({
            label: `${activity.activityName} (Activity)`,
            value: activity.isComplimentary ? 0 : activity.price,
            show: price?.showBreakUp,
            highlight: false,
        })),
        { label: "Final Price", value: price?.discountedPrice, show: true, highlight: true },
    ].filter(Boolean);

    const rowsGroupTrip = [
        { label: "Single Occupancy", value: tripDetails?.tripDetails?.occupancy?.single, show: true, highlight: false },
        { label: "Double Occupancy", value: tripDetails?.tripDetails?.occupancy?.double, show: true, highlight: false },
        { label: "Triple Occupancy", value: tripDetails?.tripDetails?.occupancy?.triple, show: true, highlight: false },
    ].filter(Boolean);

    const rowsSamplePackage = [
        { label: "Total Price", value: price?.totalPrice, show: true, highlight: true },
    ].filter(Boolean);

    const rowsMap = {
        privateTrip: rowsPrivateTrip,
        groupTrip: rowsGroupTrip,
        samplePackage: rowsSamplePackage, // add when ready
    };

    const rows = rowsMap[tripType] || [];

    const fmtNum = (v) => Number(v || 0).toLocaleString("en-IN");

    return (
        <View style={styles.section}>

            {/* PRICING */}
            <Text style={styles.title}>Pricing Details</Text>

            <View style={styles.priceBox}  wrap={false}>

                {rows?.filter(r => r.show).map((r, i) => (
                    <React.Fragment key={`${r.label}-${i}`}>
                        {r.highlight && <View style={styles.divider} />}

                        <View style={r.highlight ? styles.finalRow : styles.row}>
                            <Text style={r.highlight ? styles.finalLabel : styles.label}>
                                {r.label}
                            </Text>
                            <View style={styles.priceRow}>
                                <RupeeIcon size={r.highlight ? 14 : 10} color={r.highlight ? PINK : "#fff"} />
                                <Text style={r.highlight ? styles.price : styles.value}>
                                    {fmtNum(r.value)}
                                </Text>
                            </View>
                        </View>
                    </React.Fragment>
                ))}

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
                    <View key={i} style={styles.highlightCard}  wrap={false}>

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