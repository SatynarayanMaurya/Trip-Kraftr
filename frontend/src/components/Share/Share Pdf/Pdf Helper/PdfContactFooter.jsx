// ===== components/Pdf/PdfContactFooter.jsx =====
import React from "react";
import { Phone, MessageCircle, Mail } from "lucide-react";

const NAVY = "#08255B";
const PINK = "#ED5F8D";

const CONTACT_OPTIONS = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 9919564763",
    highlighted: true,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 9919564763",
    highlighted: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: "satynarayanmaurya989@gmail.com",
    highlighted: false,
  },
];

function PdfContactFooter() {
  return (
    <div className="mt-10 text-center">
      <div
        className="text-lg font-bold tracking-[0.3em]"
        style={{ color: NAVY }}
      >
        TRIPKRAFTR
      </div>

      <h2 className="text-2xl font-bold mt-4" style={{ color: NAVY }}>
        Ready to Book Your Trip?
      </h2>

      <p className="text-sm max-w-md mx-auto mt-2 leading-relaxed" style={{ color: NAVY }}>
        Your dream vacation is just a click away. Connect with our travel
        experts to customize this itinerary or book it directly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
        {CONTACT_OPTIONS.map(({ icon: Icon, label, value, highlighted }) => (
          <div
            key={label}
            className="rounded-xl py-5 px-3 flex flex-col items-center"
            style={{
              border: `1.5px solid ${highlighted ? "#3B82F6" : "#E5E7EB"}`,
            }}
          >
            <Icon size={18} style={{ color: PINK }} />
            <div className="text-sm font-semibold mt-2" style={{ color: NAVY }}>
              {label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: NAVY }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs mt-6" style={{ color: NAVY }}>
        Visit us
        <br />
        at www.tripkraftr.com
      </div>
    </div>
  );
}

export default PdfContactFooter;