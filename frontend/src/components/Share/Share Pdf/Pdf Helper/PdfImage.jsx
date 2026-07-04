


// ===== components/Pdf/PdfImage.jsx (updated) =====
import React from "react";
import { ImageOff } from "lucide-react";

const BADGE_POS = {
  "bottom-left": "bottom-2 left-2",
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-right": "bottom-2 right-2",
};

function PdfImage({
  src,
  alt = "",
  className = "",
  style = {},
  badgePosition = "bottom-left",
  showDummyBadge = true,
  children,
}) {
  const hasImage = Boolean(src);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {hasImage ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <ImageOff size={24} className="text-gray-400" />
        </div>
      )}
      {/* {!hasImage && showDummyBadge && (
        <span
          className={`absolute ${BADGE_POS[badgePosition]} text-[10px] font-semibold px-2 py-0.5 rounded-full`}
          style={{ background: "rgba(8,37,91,0.85)", color: "#fff" }}
        >
          Dummy Image
        </span>
      )} */}
      {children}
    </div>
  );
}

export default PdfImage;










// // ===== components/Pdf/PdfImage.jsx =====
// import React from "react";
// import { ImageOff } from "lucide-react";

// const BADGE_POS = {
//   "bottom-left": "bottom-2 left-2",
//   "top-left": "top-2 left-2",
//   "top-right": "top-2 right-2",
//   "bottom-right": "bottom-2 right-2",
// };

// function PdfImage({ src, alt = "", className = "", style = {}, badgePosition = "bottom-left" }) {
//   const hasImage = Boolean(src);

//   return (
//     <div className={`relative overflow-hidden ${className}`} style={style}>
//       {hasImage ? (
//         <img src={src} alt={alt} className="w-full h-full object-cover" />
//       ) : (
//         <div className="w-full h-full flex items-center justify-center bg-gray-200">
//           <ImageOff size={24} className="text-gray-400" />
//         </div>
//       )}
//       {/* {!hasImage && (
//         <span
//           className={`absolute ${BADGE_POS[badgePosition]} text-[10px] font-semibold px-2 py-0.5 rounded-full`}
//           style={{ background: "rgba(8,37,91,0.85)", color: "#fff" }}
//         >
//           Dummy Image
//         </span>
//       )} */}
//     </div>
//   );
// }

// export default PdfImage;