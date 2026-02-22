import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Database } from "lucide-react";

function ChooseHotelType() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("self");

  const handleContinue = () => {
    navigate(selected);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen px-10 py-8">
      
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#18305C]">
          Add New Hotel
        </h1>
        <p className="text-sm text-gray-500 mt-1">Choose Path</p>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/hotels")}
        className="flex items-center gap-2 text-sm text-gray-500 mt-5 hover:text-[#18305C] transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to List
      </button>

      {/* Main Outer Container */}
      <div className="mt-8 bg-[#e5e7eb] p-8 rounded-3xl shadow-inner">

        {/* Inner White Card */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          
          <div className="grid grid-cols-2 gap-8">

            {/* Mezenga Catalog */}
            <div
              onClick={() => setSelected("catalog")}
              className={`relative cursor-pointer rounded-2xl p-6 border transition shadow-sm
              ${
                selected === "catalog"
                  ? "border-[#ED5F8D] bg-[#fff1f6]"
                  : "border-gray-200 hover:border-[#ED5F8D]"
              }`}
            >
              {/* Icon Block */}
              <div className="w-14 h-14 rounded-xl bg-[#fde7ef] flex items-center justify-center mb-4">
                <Database className="text-[#ED5F8D]" size={24} />
              </div>

              {/* Recommended Badge */}
              <span className="absolute top-6 right-6 text-[10px] font-semibold bg-[#ED5F8D] text-white px-3 py-1 rounded-full">
                RECOMMENDED
              </span>

              <h3 className="font-semibold text-[#18305C] text-[16px]">
                Mezenga Catalog
              </h3>

              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Import from our verified global database. Auto-fills
                80% of fields including high-res images and amenities.
              </p>
            </div>

            {/* Self Contracted */}
            <div
              onClick={() => setSelected("self")}
              className={`cursor-pointer rounded-2xl p-6 border transition shadow-sm
              ${
                selected === "self"
                  ? "border-[#ED5F8D] bg-[#fff1f6]"
                  : "border-gray-200 hover:border-[#ED5F8D]"
              }`}
            >
              {/* Icon Block */}
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                <Building2 className="text-gray-500" size={24} />
              </div>

              <h3 className="font-semibold text-[#18305C] text-[16px]">
                Self-Contracted
              </h3>

              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Manually enter all details for a new off-catalog property.
                Best for exclusive local partnerships.
              </p>
            </div>

          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-10">
            <button
              onClick={handleContinue}
              className="bg-[#ED5F8D] hover:bg-[#e14d7d] text-white px-10 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              Continue
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ChooseHotelType;