import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  X,
  Download,
  Link2,
  MessageCircle,
  Mail,
  Copy,
  FileText,
  Eye,
  MapPin,
} from "lucide-react";

const PINK = "#ED5F8D";
const NAVY = "#08255B";

const OPTIONS = [
  { id: "download", label: "Download PDF", icon: Download },
  { id: "link", label: "Copy Link", icon: Link2 },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "email", label: "Email", icon: Mail },
];

function ShareModal({ data, onClose }) {
  const [selected, setSelected] = useState("whatsapp");

  // Placeholder trip data — swap with real fields from `data` whenever ready
  const trip = {
    guestName: data?.guestName || "Rahul",
    tripName: data?.tripName || "Rajasthan Explorer",
    destination: data?.destination || "Rajasthan",
    startDate: data?.startDate || "12 Aug 2026",
    endDate: data?.endDate || "18 Aug 2026",
    days: data?.days || 7,
    price: data?.price || "₹45,000",
    link: data?.link || "mezenga.com/itinerary/ORG-PRTRIP-001",
    agencyName: data?.agencyName || "Mezenga Travels",
  };

  const getWhatsAppText = () =>
    `Hi ${trip.guestName}, here is your personalized itinerary for the ${trip.tripName} trip (${trip.days} Days).\n\n` +
    `Dates: ${trip.startDate} - ${trip.endDate}\n` +
    `Destination: ${trip.destination}\n` +
    `Total: ${trip.price}\n\n` +
    `Looking forward to your feedback!\n\nView here: ${trip.link}`;

  const getEmailText = () =>
    `Subject: Your ${trip.tripName} Itinerary is Ready!\n\n` +
    `Dear ${trip.guestName},\n\n` +
    `We're excited to share your personalized itinerary for the ${trip.tripName} trip.\n\n` +
    `Dates: ${trip.startDate} - ${trip.endDate}\n` +
    `Destination: ${trip.destination}\n` +
    `Total: ${trip.price}\n\n` +
    `View your full itinerary here: ${trip.link}\n\n` +
    `Best regards,\n${trip.agencyName}`;

  const handleCopy = async () => {
    let text = "";
    if (selected === "whatsapp") text = getWhatsAppText();
    else if (selected === "email") text = getEmailText();
    else if (selected === "link") text = trip.link;

    try {
      await navigator.clipboard.writeText(text);
      toast.success(
        selected === "link" ? "Link copied!" : "Message copied!"
      );
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadPdf = () => {
    // TODO: wire actual download logic
    toast.info("Downloading PDF...");
  };

  const handlePreviewPdf = () => {
    // TODO: wire actual preview logic
    toast.info("Opening PDF preview...");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl lg:max-w-4xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: PINK }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold" style={{ color: NAVY }}>
            Share Itinerary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 space-y-5">
          {/* Option grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: isActive ? PINK : "#E5E7EB",
                    background: isActive ? "#FDF1F5" : "#FFFFFF",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: isActive ? PINK : "#FCE4EC",
                      color: isActive ? "#FFFFFF" : PINK,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className="text-xs sm:text-sm font-semibold text-center"
                    style={{ color: NAVY }}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Preview label */}
          <div className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            {selected === "download" ? "Document Preview" : "Message Preview"}
          </div>

          {/* Preview box */}
          <div
            className="rounded-xl border border-gray-100 p-4"
            style={{ background: "#FDF1F5", maxHeight: "280px", overflowY: "auto" }}
          >
            {selected === "whatsapp" && (
              <div className="bg-[#DCF4E3] rounded-lg p-3">
                <div className="bg-white rounded-lg rounded-tr-none p-3 shadow-sm text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                  {getWhatsAppText()}
                </div>
                <div className="text-right text-[10px] text-gray-500 mt-1 pr-1">
                  10:42 AM ✓✓
                </div>
              </div>
            )}

            {selected === "email" && (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="font-semibold text-gray-700">To: </span>
                    {trip.guestName}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Subject: </span>
                    Your {trip.tripName} Itinerary is Ready!
                  </div>
                </div>
                <div className="p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                  {getEmailText().split("\n\n").slice(1).join("\n\n")}
                </div>
              </div>
            )}

            {selected === "link" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2.5 bg-white">
                  <Link2 size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700 truncate">
                    {trip.link}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Preview of how the link will appear
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div
                    className="h-20 flex items-center justify-center"
                    style={{ background: NAVY }}
                  >
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm" style={{ color: NAVY }}>
                      {trip.tripName} · {trip.days} Days
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {trip.destination} • {trip.startDate} - {trip.endDate}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {trip.link}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selected === "download" && (
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 w-full bg-white">
                  <div className="w-10 h-12 bg-red-50 rounded flex items-center justify-center shrink-0">
                    <FileText className="text-red-500" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium truncate"
                      style={{ color: NAVY }}
                    >
                      {trip.tripName.replace(/\s+/g, "_")}_Itinerary.pdf
                    </div>
                    <div className="text-xs text-gray-500">
                      {trip.days} pages • 1.2 MB
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handlePreviewPdf}
                    className="flex-1 rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium text-sm border-2"
                    style={{ borderColor: PINK, color: PINK, background: "#fff" }}
                  >
                    <Eye size={16} />
                    Preview PDF
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="flex-1 rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium text-sm text-white"
                    style={{ background: PINK }}
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom action (hidden for download, since its buttons are inline above) */}
          {selected !== "download" && (
            <button
              onClick={handleCopy}
              className="w-full rounded-full py-3 flex items-center justify-center gap-2 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: PINK }}
            >
              <Copy size={16} />
              {selected === "link" ? "Copy Link" : "Copy Message"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareModal;