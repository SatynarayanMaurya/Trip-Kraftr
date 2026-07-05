// ===== components/Pdf/PdfPoliciesSection.jsx =====
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const NAVY = "#08255B";
const PINK = "#ED5F8D";

const TOP_LEVEL_KEYS = ["inclusion", "exclusion", "thingsToPack"];
const POLICY_KEYS = ["payment", "cancellation"];

const SECTION_TITLES = {
  inclusion: "Inclusions",
  exclusion: "Exclusions",
  thingsToPack: "Things To Pack",
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 6,
  },

  policiesTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 10,
  },

  policyHeader: {
    fontSize: 12,
    fontWeight: 700,
    color: NAVY,
  },

  policyHighlight: {
    color: PINK,
  },

  box: {
    backgroundColor: "#FFD3E18A",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 6,
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: NAVY,
    marginTop: 5,
    marginRight: 6,
  },

  text: {
    fontSize: 10,
    color: "#555",
    flexShrink: 1,
  },

  empty: {
    fontSize: 10,
    color: "#999",
  },
});

function BulletList({ items }) {
  if (!items || items.length === 0) {
    return <Text style={styles.empty}>No details added yet.</Text>;
  }

  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={styles.bullet} />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function PdfPoliciesPDF({ policies }) {
  if (!policies) return null;

  const extraPolicyKeys = Object.keys(policies).filter(
    (k) => !TOP_LEVEL_KEYS.includes(k) && !POLICY_KEYS.includes(k)
  );

  return (
    <View style={styles.container}>
      {/* Top-level sections */}
      {TOP_LEVEL_KEYS.map((key) => (
        <View key={key}>
          <Text style={styles.sectionTitle}>
            {SECTION_TITLES[key]}
          </Text>
          <BulletList items={policies?.[key]?.policies} />
        </View>
      ))}

      {/* Policies */}
      <View>
        <Text style={styles.policiesTitle}>Policies</Text>

        {([...POLICY_KEYS, ...extraPolicyKeys]).map((key) => {
          const categoryLabel =
            policies?.[key]?.policyCategory ||
            key.charAt(0).toUpperCase() + key.slice(1);

          return (
            <View key={key} style={{ marginBottom: 10 }}>
              <Text style={styles.policyHeader}>
                {categoryLabel}{" "}
                <Text style={styles.policyHighlight}>policy</Text>
              </Text>

              <View style={styles.box}>
                <BulletList items={policies?.[key]?.policies} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default PdfPoliciesPDF;