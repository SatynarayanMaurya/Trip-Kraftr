import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function DeleteModal({ onClose, onDelete, itemName = "item", confirmText = "DELETE" }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null);
  const isProduction = useSelector((state) => state.user.isProduction)
  const isMatch = input === confirmText;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDelete = async () => {
    try {
      if (!isMatch) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      setLoading(true)
      await onDelete();
      setLoading(false)
      setInput("");
      onClose();
    }
    catch (error) {
      setLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleDelete();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in">

        {/* Red top bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-pink-500 to-pink-500" />

        <div className="p-7">

          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-5">
            <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Delete {itemName}</h2>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                This action is <span className="font-semibold text-gray-700">permanent</span> and cannot be undone.
                All associated data will be removed.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-5" />

          {/* Confirm instruction */}
          <p className="text-sm text-gray-600 mb-3">
            To confirm, type{" "}
            <span className="font-mono font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              {confirmText}
            </span>{" "}
            in the field below.
          </p>

          {/* Input */}
          <div className={`transition-all duration-150 ${shake ? "animate-shake" : ""}`}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type ${confirmText}`}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono outline-none transition-all
                ${isMatch
                  ? "border-red-400 bg-red-50 text-red-700 ring-2 ring-red-100"
                  : input.length > 0
                    ? "border-orange-300 bg-orange-50 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    : "border-gray-200 bg-gray-50 text-gray-800 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                }`}
            />
            {/* Match indicator */}
            <div className="mt-1.5 h-4 flex items-center">
              {input.length > 0 && !isMatch && (
                <p className="text-xs text-orange-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Doesn't match — keep typing
                </p>
              )}
              {isMatch && (
                <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmed — ready to delete
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 mt-5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!isMatch || loading}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center gap-2
    ${isMatch && !loading
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200 active:scale-[0.97]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}

              {loading ? "Deleting..." : `Delete ${itemName}`}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes animate-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in { animation: animate-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default DeleteModal;