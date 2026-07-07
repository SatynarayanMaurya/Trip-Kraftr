

import React, { useState } from "react";
import { Mail, Copy, Check, User, Send } from "lucide-react";
import { toast } from "react-toastify";
import { getMailContent } from "../Utils/Messages";

const PINK = "#ED5F8D";
const NAVY = "#08255B";

function MailTemplate({ data = {} }) {
  const mail = getMailContent(data);
  const [copied, setCopied] = useState(null); // "subject" | "body" | null

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success(key === "subject" ? "Subject copied!" : "Body copied!");
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-4"
        style={{ background: "#FDF1F5" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: PINK, color: "#fff" }}
        >
          <Mail size={15} />
        </div>
        <span className="text-sm font-semibold" style={{ color: NAVY }}>
          Email Preview
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Meta: From / To */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Send size={13} className="text-gray-400 shrink-0" />
            <span className="text-gray-500">From:</span>
            <span className="font-medium truncate" style={{ color: NAVY }}>
              {mail.from}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User size={13} className="text-gray-400 shrink-0" />
            <span className="text-gray-500">To:</span>
            <span className="font-medium truncate" style={{ color: NAVY }}>
              {mail.to}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Subject */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Subject
            </span>
            <button
              onClick={() => copyToClipboard(mail.subject, "subject")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: copied === "subject" ? "#DCFCE7" : "#FDF1F5",
                color: copied === "subject" ? "#16A34A" : PINK,
              }}
            >
              {copied === "subject" ? <Check size={13} /> : <Copy size={13} />}
              {copied === "subject" ? "Copied" : "Copy"}
            </button>
          </div>
          <div
            className="text-sm font-semibold rounded-lg px-3 py-2.5"
            style={{ color: NAVY, background: "#F9FAFB" }}
          >
            {mail.subject}
          </div>
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Body
            </span>
            <button
              onClick={() => copyToClipboard(mail.body, "body")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: copied === "body" ? "#DCFCE7" : "#FDF1F5",
                color: copied === "body" ? "#16A34A" : PINK,
              }}
            >
              {copied === "body" ? <Check size={13} /> : <Copy size={13} />}
              {copied === "body" ? "Copied" : "Copy"}
            </button>
          </div>
          <pre
            className="whitespace-pre-wrap text-sm leading-relaxed rounded-lg p-4 border border-gray-100"
            style={{
              background: "#F9FAFB",
              color: "#374151",
              maxHeight: "260px",
              overflowY: "auto",
              fontFamily: "inherit",
            }}
          >
            {mail.body}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default MailTemplate;



// import React from "react";
// import { getMailContent } from "../Utils/Messages";

// function MailTemplate({ data = {} }) {

//     const mail = getMailContent(data);

//     return (
//         <div>
//             <h3>{mail.subject}</h3>

//             <p>
//                 From: {mail.from}
//             </p>

//             <p>
//                 To: {mail.to}
//             </p>

//             <pre className="whitespace-pre-wrap">
//                 {mail.body}
//             </pre>
//         </div>
//     );
// }

// export default MailTemplate;