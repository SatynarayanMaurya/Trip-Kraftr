import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { CallIcon, EmailIcon, WhatsAppIcon } from "./Icons";

const NAVY = "#08255B";
const PINK = "#ED5F8D";

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
    textAlign: "center",
  },

  brand: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 3,
    color: NAVY,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    color: NAVY,
  },

  subtitle: {
    fontSize: 10,
    marginTop: 6,
    color: NAVY,
    lineHeight: 1.4,
    paddingHorizontal: 40,
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    paddingHorizontal: 10,
    gap: 10,
  },

  card: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  highlightCard: {
    borderColor: PINK,
  },

  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF1F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: NAVY,
  },

  value: {
    fontSize: 8,
    color: NAVY,
    marginTop: 3,
    textAlign: "center",
  },

  footer: {
    marginTop: 20,
    fontSize: 9,
    color: NAVY,
  },
});

function PdfContactFooterPDF() {
  const ICON_SIZE = 16;

  const CONTACT_OPTIONS = [
    {
      icon: <CallIcon size={ICON_SIZE} color={PINK} />,
      label: "Call Us",
      value: "+91 9919564763",
      highlighted: true,
    },
    {
      icon: <WhatsAppIcon size={ICON_SIZE} color="#25D366" />,
      label: "WhatsApp",
      value: "+91 9919564763",
      highlighted: false,
    },
    {
      icon: <EmailIcon size={ICON_SIZE} color={PINK} />,
      label: "Email",
      value: "satynarayanmaurya989@gmail.com",
      highlighted: false,
    },
  ];

  return (
    <View style={styles.wrapper} wrap={false}>
      {/* BRAND */}
      <Text style={styles.brand}>TRIPKRAFTR</Text>

      {/* TITLE */}
      <Text style={styles.title}>Ready to Book Your Trip?</Text>

      {/* DESCRIPTION */}
      <Text style={styles.subtitle}>
        Your dream vacation is just a click away. Connect with our travel experts
        to customize this itinerary or book it directly.
      </Text>

      {/* CONTACT GRID */}
      <View style={styles.grid}>
        {CONTACT_OPTIONS.map((item) => (
          <View
            key={item.label}
            style={[
              styles.card,
              item.highlighted && styles.highlightCard,
            ]}
          >
            {/* ICON */}
            <View style={styles.iconWrapper}>
              {item.icon}
            </View>

            {/* LABEL */}
            <Text style={styles.label}>{item.label}</Text>

            {/* VALUE */}
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        Visit us at www.tripkraftr.com
      </Text>
    </View>
  );
}

export default PdfContactFooterPDF;