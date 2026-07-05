// components/Pdf/PdfSections/PdfDayDetailsPdf.jsx

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import PdfImagePdf from "./PdfImagePdf";
import RupeesSymbol from "./Icons/Rupees.png"

const PINK = "#ED5F8D";
const NAVY = "#08255B";

const styles = StyleSheet.create({

  dayWrapper: {
    marginTop: 20,
  },

  dayTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: PINK,
    marginBottom: 8,
  },

  hotelCard: {
    flexDirection: "row",
    backgroundColor: "#FFBCD275",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    position:'relative'
  },

  hotelInfo: {
    flex: 1,
    paddingLeft: 10,
  },

  hotelName: {
    fontSize: 11,
    fontWeight: "bold",
    color: NAVY,
  },

  hotelMeta: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#6B7280",
    marginTop: 5,
    marginBottom: 3,
  },

  roomTag: {
    fontSize: 8,
    borderWidth: 1,
    borderColor: "#F0C4D4",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
    color: NAVY,
  },

  flexRow: {
    flexDirection: "row",
    gap: 10,
  },

  dayPlanCard: {
    flexDirection: "row",
    backgroundColor: "#9CBFFF57",
    borderRadius: 8,
    padding: 10,
  },

  dayText: {
    fontSize: 10,
    color: NAVY,
    fontWeight: "bold",
    marginBottom: 6,
  },

  listItem: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 3,
  },

  bullet: {
    fontSize: 9,
    marginRight: 5,
    color: PINK,
  },

  empty: {
    fontSize: 9,
    color: "#9CA3AF",
  },

  vehicleTag: {
    fontSize: 8,
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },
});

function getMealsText(rooms) {
  const plans = [...new Set(rooms.map((r) => r?.mealPlan).filter(Boolean))];
  return plans.length ? plans.join(", ").toUpperCase() : "—";
}


const getImageHeight =(day)=>{
    return Math.max(
  100,
  (day.places.length * 18 +  day.activities.length * 18 + 30)
);
}

function PdfDayDetailsPdf({ days = [] }) {
  return (
    <View >

      {days?.map((day,index) => (
        <View key={day.dayNumber}     
            style={[
                styles.dayWrapper,
            ]}>

          {/* DAY TITLE */}
          <Text style={styles.dayTitle}>
            Day {day.dayNumber}
          </Text>

          {/* HOTEL CARD */}
          <View style={styles.hotelCard}>

            {/* VEHICLES (top right block removed absolute → inline) */}
            <View style={{ position: "absolute", top: 2, right: 2,width:'20%', flexDirection: "row", flexWrap: "wrap" }}>
              {day?.vehicleDetails?.map((v) => (
                <Text key={v._id} style={styles.vehicleTag}>
                  {v.vehicleModel} ×{v.quantity} {v.pricePerDay}
                </Text>
              ))}
            </View>

            {/* HOTEL IMAGE */}
            <PdfImagePdf
              src={day.hotel.image}
              style={{ width: 200, height:100, borderRadius: 6 }}
            />

            {/* HOTEL INFO */}
            <View style={styles.hotelInfo}>

              <Text style={styles.hotelName}>
                {day.hotel.name || "Hotel not selected"}
              </Text>

              <Text style={styles.hotelMeta}>
                Stay: {day.hotel.category || "—"}
              </Text>

              <Text style={styles.sectionTitle}>
                Room Details
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {day.hotel.rooms.length === 0 ? (
                  <Text style={styles.empty}>No rooms added</Text>
                ) : (
                  day.hotel.rooms.map((r) => (
                    <Text key={r._id} style={styles.roomTag}>
                      {r.roomType} · {(r.mealPlan || "").toUpperCase()} · EM:{r.noOfExtraMattress ?? 0} · CNB:{r.noOfCnb ?? 0}
                    </Text>
                  ))
                )}
              </View>

            </View>
          </View>

          {/* DAY PLAN */}
          <View style={styles.dayPlanCard}>

            {/* LEFT */}
            <View style={{ flex: 1 }}>

              <Text style={styles.dayText}>
                {day.dayOverview || `Day ${day.dayNumber} Plan`}
              </Text>

              {/* PLACES */}
              <Text style={styles.sectionTitle}>Places</Text>

              {day.places.length === 0 ? (
                <Text style={styles.empty}>No places added</Text>
              ) : (
                day.places.map((p, i) => (
                  <Text key={i} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text> {p}
                  </Text>
                ))
              )}

              {/* ACTIVITIES */}
              <Text style={styles.sectionTitle}>Activities</Text>

              {day.activities.length === 0 ? (
                <Text style={styles.empty}>No activities added</Text>
              ) : (
                day.activities.map((a, i) => (
                  <Text key={i} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text> {a}
                  </Text>
                ))
              )}

            </View>

            {/* IMAGE */}
            <PdfImagePdf
              src={day.placeImage}
              style={{ width: 200, height: getImageHeight(day), borderRadius: 6 }}
            />

          </View>

        </View>
      ))}

    </View>
  );
}

export default PdfDayDetailsPdf;