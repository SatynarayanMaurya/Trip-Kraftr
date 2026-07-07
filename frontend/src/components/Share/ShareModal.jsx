import React, { useState } from "react";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import {
    X,
    Download,
    Loader2 ,
    Link2,
    MessageCircle,
    Mail,
    Copy,
    FileText,
    Eye,
    MapPin,
    Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTripPdfData } from "../../hooks/useTripPdfData";
import TripPdf from "./Share Pdf/Trip Pdf/TripPdf";
import TripPdfGroupTrip from "./Share Pdf/Trip Pdf/TripPdfGroupTrip";
import WhatsappTemplate from "./Templates/WhatsappTemplate";
import MailTemplate from "./Templates/MailTemplate";
import LinkTemplate from "./Templates/LinkTemplate";
import { getMailContent, getUrl, getWhatsappMessage } from "./Utils/Messages";
import { useSelector } from "react-redux";
import { useMailHooks } from "../../hooks/useMailHooks";

const PINK = "#ED5F8D";
const NAVY = "#08255B";

const OPTIONS = [
    { id: "download", label: "Download PDF", icon: Download },
    { id: "link", label: "Copy Link", icon: Link2 },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "email", label: "Email", icon: Mail },
];

function ShareModal({ onClose, data = {}, tripType = 'privateTrip' }) {
    const [selected, setSelected] = useState("whatsapp");
    const navigate = useNavigate()
    const { sendMail } = useMailHooks()
    const isProduction = useSelector(s => s.user.isProduction)
    const [downloadPdfLoading, setDownloadPdfLoading] = useState(false)
    const [mailLoading, setMailLoading] = useState(false)

    const {
        loading: pdfLoading,
        tripDetails,
        regionsImage,
        policies,
    } = useTripPdfData({
        tripId: data?._id,
        tripType,
    });

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

    const handleShareWhatsapp = () => {
        const message = getWhatsappMessage(data, tripType);

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    }

    const handleCopyUrl = async () => {
        const link = getUrl(data, tripType);

        if (!link) return;

        try {
            await navigator.clipboard.writeText(link);
            toast.success("URL copied successfully")
        } catch (error) {
            console.error("Failed to copy URL:", error);
        }
    };

    const handleSendEmail = async () => {
        try {
            setMailLoading(true)
            const { from, to, subject, body } = getMailContent(data, tripType)
            return toast.info("This feature is under development. Please check back later.")
            const response = await sendMail(from, to, subject, body)
            toast.success(response?.data?.message)
            onClose()
        }
        catch (error) {
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }
        finally {
            setMailLoading(false)
        }

    }

    const handlePreviewPdf = () => {

        if (tripType === 'privateTrip') {
            window.open(`/private-trip/${data?._id}`, "_blank");
        }
        else if (tripType === 'samplePackage') {
            window.open(`/sample-package/${data?._id}`, "_blank");
        }
        else if (tripType === 'groupTrip') {
            window.open(`/group-trip/${data?._id}`, "_blank");
        }
    };

    const handleDownloadPdf = async () => {

        try {
            setDownloadPdfLoading(true)
            let blob = null
            if (tripType !== 'groupTrip') {
                blob = await pdf(
                    <TripPdf
                        tripDetails={tripDetails}
                        regionsImage={regionsImage}
                        policies={policies}
                        tripType={tripType}
                    />
                ).toBlob();
            }
            else {
                blob = await pdf(
                    <TripPdfGroupTrip
                        tripDetails={tripDetails}
                        regionsImage={regionsImage}
                        policies={policies}
                        tripType={tripType}
                    />
                ).toBlob();
            }

            setDownloadPdfLoading(false)



            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = "Trip.pdf";

            link.click();

            URL.revokeObjectURL(url);

        }
        catch (error) {
            console.log("Error in download the pdf : ", error)
            toast.error(error?.message || "Error in download the pdf")
        }

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
                            <WhatsappTemplate data={data} tripType={tripType} />
                        )}

                        {selected === "email" && (
                            <MailTemplate data={data} tripType={tripType} />
                        )}

                        {selected === "link" && (
                            <LinkTemplate data={data} tripType={tripType} />
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
                                        disabled={pdfLoading}
                                        onClick={handlePreviewPdf}
                                        className="flex-1 rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium text-sm border-2"
                                        style={{ borderColor: PINK, color: PINK, background: "#fff" }}
                                    >
                                        {pdfLoading ? "Preparing..." : "Preview PDF"}
                                    </button>

                                    <button
                                        disabled={pdfLoading || downloadPdfLoading}
                                        onClick={handleDownloadPdf}
                                        className="flex-1 rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium text-sm text-white"
                                        style={{ background: PINK }}
                                    >
                                        {(pdfLoading || downloadPdfLoading) ? "Preparing..." : "Download PDF"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom action (hidden for download, since its buttons are inline above) */}
                    {selected === "link" && (
                        <button
                            onClick={handleCopyUrl}
                            className="w-full rounded-full py-3 flex items-center justify-center gap-2 font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ background: PINK }}
                        >
                            <Copy size={16} />
                            {selected === "link" ? "Copy Link" : "Copy Message"}
                        </button>
                    )}
                    {/* Bottom action (hidden for download, since its buttons are inline above) */}
                    {selected === "whatsapp" && (
                        <button
                            onClick={handleShareWhatsapp}
                            className="w-full rounded-full py-3 flex items-center justify-center gap-2 font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ background: PINK }}
                        >
                            <Send size={16} />
                            Share
                        </button>
                    )}
                    {/* Bottom action (hidden for download, since its buttons are inline above) */}
                    {selected === "email" && (
                        <button
                            onClick={handleSendEmail}
                            disabled={mailLoading}
                            className={`w-full rounded-full py-3 flex items-center justify-center gap-2 font-semibold text-white transition-opacity ${mailLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                            style={{ background: PINK }}
                        >
                            {mailLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail size={16} />
                                    Send Mail
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShareModal;