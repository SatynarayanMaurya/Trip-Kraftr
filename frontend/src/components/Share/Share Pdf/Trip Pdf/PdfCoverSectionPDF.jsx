// components/Pdf/PdfSections/PdfCoverSectionPdf.jsx

import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import PdfImagePdf from "./PdfImagePDF";
import { RupeeIcon } from "./Icons";
const PINK = "#ED5F8D";
const NAVY = "#08255B";

const styles = StyleSheet.create({
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },


    price: {
        color: PINK,
        fontSize: 16,
        fontWeight: "bold",
    },
    heroWrapper: {
        position: "relative",
        width: "100%",
        height: 380,
    },

    heroImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    overlayTop: {
        position: "absolute",
        top: 30,
        width: "100%",
        textAlign: "center",
    },

    regionName: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#fff",
        textTransform: "uppercase",
    },

    brand: {
        fontSize: 24,
        color: "rgba(255,255,255,0.9)",
        marginTop: 4,
    },

    subTitle: {
        fontSize: 16,
        color: "rgba(255,255,255,0.9)",
        marginTop: 10,
        letterSpacing: 2,
    },

    bottomLeft: {
        position: "absolute",
        bottom: 12,
        left: 12,
        fontSize: 10,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.4)",
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
    },

    bottomRightCard: {
        position: "absolute",
        bottom: 12,
        right: 12,
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 6,
        textAlign: "center",
    },

    priceLabel: {
        fontSize: 8,
        color: "#777",
    },


    priceSub: {
        fontSize: 8,
        color: "#999",
    },

    section: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    left: {
        width: "55%",
    },

    right: {
        width: "40%",
    },

    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: NAVY,
    },

    overview: {
        fontSize: 10,
        color: "#555",
        marginTop: 6,
        lineHeight: 1.4,
    },

    card: {
        flexDirection: "row",
        marginBottom: 8,
        backgroundColor: "#FDF1F5",
        padding: 8,
        borderRadius: 6,
    },

    iconBox: {
        width: 22,
        height: 22,
        backgroundColor: PINK,
        borderRadius: 11,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        marginRight: 8,
    },
    iconText: {
        fontSize: 10,
        color: "#fff",
        textAlign: "center",
    },

    label: {
        fontSize: 8,
        color: "#666",
    },

    value: {
        fontSize: 10,
        color: NAVY,
        fontWeight: "bold",
    },
});

function PdfCoverSectionPdf({ data }) {
    const {
        regionImage,
        regionName,
        tripLabel,
        days,
        startingPrice,
        tripName,
        tripOverview,
        destination,
        duration,
        travelDates,
        tripTypeText,
        orgInitial,
    } = data;

    const infoCards = [
        { label: "Destination", value: destination, icon: "📍" },
        { label: "Duration", value: duration, icon: "⏱" },
        { label: "Dates", value: travelDates, icon: "📅" },
        { label: "Type", value: tripTypeText, icon: "👥" },
    ];

    return (
        <View>

            {/* HERO */}
            <PdfImagePdf
                src={regionImage}
                style={styles.heroWrapper}
            >

                {/* TOP TEXT */}
                <View style={styles.overlayTop}>
                    <Text style={styles.regionName}>{regionName}</Text>
                    <Text style={styles.brand}>TripKraftr</Text>
                    <Text style={styles.subTitle}>
                        {tripLabel} | {days} DAYS
                    </Text>
                </View>

                {/* BOTTOM LEFT */}
                <View style={styles.bottomLeft}>
                    <Text>@satynarayan.maurya</Text>
                </View>

                {/* BOTTOM RIGHT PRICE */}
                <View style={styles.bottomRightCard}>
                    <Text style={styles.priceLabel}>Starting from</Text>
                    <View style={styles.priceRow}>
                        <RupeeIcon size={14} color={PINK} />
                        <Text style={styles.price}>{startingPrice}</Text>
                    </View>
                    {/* <Text style={styles.priceSub}>/ per person</Text> */}
                </View>

            </PdfImagePdf>


            {/* CONTENT SECTION */}
            <View style={styles.section}>

                {/* LEFT */}
                <View style={styles.left}>
                    <Text style={styles.title}>
                        TripKraftr Itinerary {"\n"} {tripName}
                    </Text>

                    <Text style={[styles.title, { fontSize: 10, marginTop: 10 }]}>
                        Overview
                    </Text>

                    <Text style={styles.overview}>
                        {tripOverview || "No overview added yet."}
                    </Text>
                </View>

                {/* RIGHT */}
                <View style={styles.right}>
                    {infoCards.map((item, i) => (
                        <View key={i} style={styles.card}>
                            <View style={styles.iconBox}>
                                <Text style={styles.iconText}></Text>
                            </View>
                            <View>
                                <Text style={styles.label}>{item.label}</Text>
                                <Text style={styles.value}>
                                    {item.value || "—"}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

            </View>

        </View>
    );
}

export default PdfCoverSectionPdf;