// import React from "react";

// function HotelTableSkeleton({ rows = 5 }) {
//   return (
//     <tbody>
//       {Array(rows)
//         .fill(0)
//         .map((_, index) => (
//           <tr key={index} className="border-t border-dashed border-blue-200">
//             <td className="px-6 py-4">
//               <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
//               <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
//             </td>

//             <td className="px-6 py-4">
//               <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
//             </td>

//             <td className="px-6 py-4">
//               <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
//             </td>

//             <td className="px-6 py-4">
//               <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
//             </td>

//             <td className="px-6 py-4">
//               <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
//             </td>

//             <td className="px-6 py-4">
//               <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
//             </td>
//           </tr>
//         ))}
//     </tbody>
//   );
// }

// export default HotelTableSkeleton;


function HotelTableSkeleton({ rows = 5 }) {
    return (
      <>
        {Array(rows)
          .fill(0)
          .map((_, index) => (
            <tr
              key={index}
              className="border-t border-dashed border-blue-200"
            >
              <td className="px-6 py-3">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
      </>
    );
  }

  export default HotelTableSkeleton;