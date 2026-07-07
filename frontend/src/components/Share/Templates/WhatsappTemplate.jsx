import React from "react";
import { getWhatsappMessage } from "../Utils/Messages";

function WhatsappTemplate({ data = {},tripType="privateTrip" }) {


    const message = getWhatsappMessage(data,tripType)

    return (
        <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 rounded-t-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center text-lg font-semibold">
                    M
                </div>

                <div>
                    <h3 className="font-medium">{'Mezenga'}</h3>
                    <p className="text-xs text-green-100">WhatsApp Preview</p>
                </div>
            </div>

            {/* Chat Background */}
            <div className="bg-[#E5DDD5] p-5 rounded-b-xl min-h-125">
                <div className="ml-auto max-w-[90%] bg-[#DCF8C6] rounded-2xl rounded-tr-md px-4 py-3 shadow">
                    <p
                        className="text-[15px] leading-7 whitespace-pre-wrap wrap-break-words text-gray-900"
                        dangerouslySetInnerHTML={{
                            __html: message
                                .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
                                .replace(
                                    /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*)/g,
                                    '<span class="text-blue-600 underline">$1</span>'
                                ),
                        }}
                    />

                    <div className="text-right text-[11px] text-gray-500 mt-2">
                        10:42 AM ✓✓
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhatsappTemplate;