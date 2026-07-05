// components/Pdf/PdfSections/PdfImagePdf.jsx

import React from "react";
import { View, Image, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  fallback: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E7EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackText: {
    fontSize: 10,
    color: "#6B7280",
  },
});

function PdfImagePdf({ src, children, style }) {
  return (
    <View style={[{ position: "relative" }, style]}>
      {src ? (
        <Image
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 10, color: "#6B7280" }}>
            No Image Available
          </Text>
        </View>
      )}

      {children}
    </View>
  );
}

export default PdfImagePdf;