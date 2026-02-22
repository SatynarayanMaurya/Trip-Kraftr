import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import ReviewPublishModal from "./Modals/ReviewPublishModal";
import SuccessModal from "../Global Modal/SuccessModal";
import { useState } from "react";

function AddHotel() {
  const navigate = useNavigate();
  const [reviewOpen, setReviewOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  return (
    <div className="bg-[#f3f4f6] min-h-screen px-10 py-8">

      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#18305C]">
          Add New Hotel
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Provide basic property and contact details
        </p>
      </div>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 mt-5 hover:text-[#18305C] cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to List
      </button>

      {/* Outer Grey Container */}
      <div className="mt-8 bg-[#e5e7eb] p-8 rounded-3xl shadow-inner">

        {/* Inner White Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">

            <Input
              label="Hotel Name *"
              placeholder="e.g. Tawang Homestay"
              autoFocus
            />

            <Select label="Category *" />

            <Input
              label="Region *"
              placeholder="e.g. Arunachal Pradesh"
            />

            <Input
              label="Sub-Region *"
              placeholder="e.g. Tawang"
            />

            <Input
              label="Contact *"
              placeholder="+91 0000000000"
            />

            <Input
              label="Email"
              placeholder="e.g. Tawang@gmail.com"
            />

            <Input
              label="Address"
              placeholder="Enter address"
            />

            <Input
              label="Contract details"
              placeholder="Enter details"
            />

          </div>

          {/* Rating + Image Section */}
          <div className="grid grid-cols-2 gap-8 mt-8">

            {/* Google Rating */}
            <div>
              <label className="block text-sm font-semibold text-[#18305C] mb-3">
                Google Rating
              </label>
              <div className="flex gap-2 text-gray-300 text-2xl cursor-pointer">
                ★ ★ ★ ★ ★
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#18305C] mb-3">
                Images
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:border-[#ED5F8D] transition">

                <div className="flex justify-center mb-3">
                  <Upload className="text-gray-400" size={28} />
                </div>

                <button className="text-sm font-medium text-[#18305C] border px-4 py-1 rounded-lg bg-white shadow-sm">
                  Browse file
                </button>

                <p className="text-xs text-gray-400 mt-3">
                  Upload up to 5 images
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl border border-gray-300 bg-white text-gray-600 shadow-sm hover:shadow-md transition"
          >
            Cancel
          </button>

          <button onClick={()=>setReviewOpen(true)} className="px-6 py-2 rounded-xl bg-[#ED5F8D] text-white shadow-md hover:bg-[#e14d7d] transition">
            Save
          </button>
        </div>

      </div>

      <ReviewPublishModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={() => {
            setReviewOpen(false)
            setSuccessOpen(true)
        }}
        />

        <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        />
    </div>
  );
}

/* Reusable Input */
function Input({ label, placeholder, autoFocus }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#18305C] mb-2">
        {label}
      </label>
      <input
        autoFocus={autoFocus}
        type="text"
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ED5F8D] focus:border-[#ED5F8D] transition"
      />
    </div>
  );
}

/* Reusable Select */
function Select({ label }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#18305C] mb-2">
        {label}
      </label>
      <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ED5F8D] focus:border-[#ED5F8D] transition">
        <option>Budget</option>
        <option>Standard</option>
        <option>Premium</option>
        <option>Luxury</option>
      </select>
    </div>
  );
}

export default AddHotel;