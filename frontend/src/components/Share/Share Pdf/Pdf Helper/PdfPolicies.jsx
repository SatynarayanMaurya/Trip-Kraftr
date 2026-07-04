// ===== components/Pdf/PdfPolicies.jsx =====
import React from "react";

const NAVY = "#08255B";
const PINK = "#ED5F8D";

const TOP_LEVEL_KEYS = ["inclusion", "exclusion", "thingsToPack"];
const POLICY_KEYS = ["payment", "cancellation"];

const SECTION_TITLES = {
  inclusion: "Inclusions",
  exclusion: "Exclusions",
  thingsToPack: "Things To Pack",
};

function BulletList({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-gray-400">No details added yet.</div>;
  }
  return (
    <ul className="my-2 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
          <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: NAVY }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PdfPolicies({ policies }) {
  if (!policies) return null;

  // Any policy keys beyond the known Payment/Cancellation (future-proofing)
  const extraPolicyKeys = Object.keys(policies).filter(
    (k) => !TOP_LEVEL_KEYS.includes(k) && !POLICY_KEYS.includes(k)
  );

  return (
    <div className="mt-8 space-y-8">
      {/* Inclusions / Exclusions / Things To Pack */}
      {TOP_LEVEL_KEYS.map((key) => (
        <div key={key}>
          <h3 className="text-xl font-bold" style={{ color: NAVY }}>
            {SECTION_TITLES[key]}
          </h3>
          <BulletList items={policies?.[key]?.policies} />
        </div>
      ))}

      {/* Policies group: Payment, Cancellation, + any others */}
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>
          Policies
        </h2>
        <div className="space-y-6">
          {[...POLICY_KEYS, ...extraPolicyKeys].map((key) => {
            const categoryLabel =
              policies?.[key]?.policyCategory ||
              key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <div key={key}>
                <h4 className="text-base font-bold" style={{color: NAVY }}>
                  {categoryLabel} <span style={{ color: PINK }}>policy</span>
                </h4>
                <div className="bg-[#FFD3E18A] py-1 rounded-xl px-4 mt-2 ">
                    
                <BulletList items={policies?.[key]?.policies} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PdfPolicies;