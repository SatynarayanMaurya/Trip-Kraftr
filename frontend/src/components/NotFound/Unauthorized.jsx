import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Update these quick links to match your sidebar
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    label: "Vehicles",
    path: "/vehicles",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
//   {
//     label: "B2B Trips",
//     path: "/manage-b2b-trips",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//       </svg>
//     ),
//   },
//   {
//     label: "Sample Trips",
//     path: "/my-sample-trips",
//     icon: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
];

// Animated lock rings
const PulsingLock = () => (
  <div className="relative flex items-center justify-center w-32 h-32 mx-auto mb-6">
    {/* Outer pulse rings */}
    <span className="absolute w-32 h-32 rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: "2.5s" }} />
    <span className="absolute w-24 h-24 rounded-full border border-red-500/15 animate-ping" style={{ animationDuration: "2s" }} />

    {/* Middle ring */}
    <div className="absolute w-24 h-24 rounded-full border border-red-500/20" />

    {/* Icon card */}
    <div className="relative w-16 h-16 rounded-2xl bg-[#1a2235] border border-red-500/30 flex items-center justify-center shadow-2xl shadow-red-500/10">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
  </div>
);

export default function Unauthorized() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    if (countdown === 0) { navigate("/dashboard"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-[#0f1623] text-white flex flex-col items-center justify-center px-6 py-6 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-[-100px] right-[-80px] w-80 h-80 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] w-64 h-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[200px] font-black text-[#1a2235] leading-none tracking-tighter opacity-60">
          401
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl">

        {/* Animated lock */}
        <PulsingLock />

        {/* Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 text-xs font-semibold tracking-widest uppercase">
            Access Denied
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          You're not supposed to be here
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-2">
          This page is restricted to <span className="text-white font-semibold">Super Admins</span> only.
          Your current role doesn't have the required permissions to view this content.
        </p>

        {/* Role pill */}
        <div className="flex items-center gap-2 mt-1 mb-8 bg-[#1a2235] border border-[#2a3448] rounded-xl px-4 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs text-gray-400">Your role:</span>
          <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full">
            org_admin
          </span>
          <span className="text-gray-600 text-xs mx-1">·</span>
          <span className="text-xs text-gray-400">Required:</span>
          <span className="text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full">
            super_admin
          </span>
        </div>

        {/* Countdown bar */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Redirecting you to safety</span>
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
            Back to Dashboard
          </button>
        </div>

        {/* Quick nav card */}
        <div className="w-full">
          <div className="bg-[#1a2235] border border-[#2a3448] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#2a3448] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#f5a623]/10 border border-[#f5a623]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#f5a623]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Pages you can access</p>
                <p className="text-xs text-gray-500">Navigate to any of your permitted sections</p>
              </div>
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
          If you need access to this page, contact your{" "}
          <span className="text-gray-400">Super Admin</span>.
        </p>
      </div>
    </div>
  );
}