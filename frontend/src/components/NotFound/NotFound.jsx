import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const quickLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Hotels",
    path: "/hotels",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
      </svg>
    ),
  },
  {
    label: "Vehicles",
    path: "/vehicle",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
//   {
//     label: "Manage Group Trips",
//     path: "/manage-group-trips",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//       </svg>
//     ),
//   },
//   {
//     label: "Policies",
//     path: "/policies",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//       </svg>
//     ),
//   },
//   {
//     label: "Admin",
//     path: "/admin",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       </svg>
//     ),
//   },
];

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(20);

  // Auto-redirect to dashboard after 10s
  useEffect(() => {
    if (countdown === 0) { navigate("/dashboard"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const badPath = location?.pathname || "/unknown";

  return (
    <div className="min-h-screen bg-[#0f1623] text-white flex flex-col items-center justify-center px-6 py-6 relative overflow-hidden">

      {/* Decorative blurred blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-[#f5a623]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Big 404 */}
      <div className="relative mb-2 select-none">
        <span className="text-[120px] sm:text-[160px] font-black leading-none text-[#1a2235] tracking-tighter">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter bg-linear-to-b from-[#f5a623] to-[#c97f0a] bg-clip-text text-transparent opacity-10">
            404
          </span>
        </span>
        {/* Floating icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#1a2235] border border-[#2a3448] flex items-center justify-center shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-[#f5a623]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">Page Not Found</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Oops! This route doesn't exist
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          The page{" "}
          <span className="text-white font-mono bg-[#1a2235] border border-[#2a3448] px-2 py-0.5 rounded-lg text-xs">
            {badPath}
          </span>{" "}
          couldn't be found. It may have been moved, deleted, or never existed.
        </p>
      </div>

      {/* Countdown bar */}
      <div className="w-full max-w-sm mt-6 mb-8">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Auto-redirecting to Dashboard</span>
          <span className="text-[#f5a623] font-semibold">{countdown}s</span>
        </div>
        <div className="w-full h-1.5 bg-[#1a2235] rounded-full overflow-hidden border border-[#2a3448]">
          <div
            className="h-full bg-linear-to-r from-[#f5a623] to-[#e09615] rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 20) * 100}%` }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#2a3448] text-gray-400 hover:text-white hover:border-[#3a4458] text-sm font-medium transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#f5a623] hover:bg-[#e09615] text-black font-semibold text-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Dashboard
        </button>
      </div>

      {/* Quick Navigation */}
      <div className="w-full max-w-2xl">
        <div className="bg-[#1a2235] border border-[#2a3448] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2a3448] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f5a623]/10 border border-[#f5a623]/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#f5a623]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">Quick Navigation</p>
            <span className="ml-auto text-xs text-gray-500">Jump to any section</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#2a3448]">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-5 py-4 bg-[#1a2235] hover:bg-[#1f2a3c] transition-colors group"
              >
                <span className="text-gray-500 group-hover:text-[#f5a623] transition-colors">
                  {link.icon}
                </span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                  {link.label}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 ml-auto text-gray-600 group-hover:text-[#f5a623] transition-colors opacity-0 group-hover:opacity-100"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-600 text-center">
        If you believe this is an error, please contact your system administrator.
      </p>
    </div>
  );
}