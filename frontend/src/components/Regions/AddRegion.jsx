import { useState, useRef, useEffect } from "react";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import { useSelector } from "react-redux";
import { useRegionHooks } from "../../hooks/useRegionHooks";
import { toast } from "react-toastify";

// Dummy data
const DUMMY_COUNTRIES = [
  "India", "Thailand", "Nepal", "Bhutan", "Sri Lanka",
  "Maldives", "Indonesia", "Vietnam", "Cambodia", "Japan",
];

const DUMMY_REGIONS = {
  India: ["Uttar Pradesh", "Maharashtra", "Rajasthan", "Kerala", "Goa", "Himachal Pradesh", "Uttarakhand", "Arunachal Pradesh", "Sikkim", "Karnataka"],
  Thailand: ["Phuket", "Bangkok", "Chiang Mai", "Pattaya", "Koh Samui", "Krabi"],
  Nepal: ["Kathmandu", "Pokhara", "Chitwan", "Lumbini"],
  Bhutan: ["Thimphu", "Paro", "Punakha", "Wangdue"],
  "Sri Lanka": ["Colombo", "Kandy", "Galle", "Ella"],
  Maldives: ["Male", "Maafushi", "Baa Atoll"],
  Indonesia: ["Bali", "Jakarta", "Lombok", "Yogyakarta"],
  Vietnam: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hoi An"],
  Cambodia: ["Siem Reap", "Phnom Penh", "Sihanoukville"],
  Japan: ["Tokyo", "Kyoto", "Osaka", "Hokkaido"],
};

const DUMMY_REGION_IMAGES = {
  "Uttar Pradesh": [
    { id: 1, url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop", label: "Taj Mahal" },
    { id: 2, url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop", label: "Varanasi Ghats" },
    { id: 3, url: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=300&h=200&fit=crop", label: "Lucknow" },
  ],
  Maharashtra: [
    { id: 4, url: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=300&h=200&fit=crop", label: "Mumbai Gateway" },
    { id: 5, url: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=300&h=200&fit=crop", label: "Pune Hills" },
  ],
  Phuket: [
    { id: 6, url: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=300&h=200&fit=crop", label: "Patong Beach" },
    { id: 7, url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300&h=200&fit=crop", label: "Big Buddha" },
    { id: 8, url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&h=200&fit=crop", label: "Phi Phi Islands" },
  ],
  default: [
    { id: 9, url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=200&fit=crop", label: "Landscape 1" },
    { id: 10, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop", label: "Mountains" },
    { id: 11, url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&h=200&fit=crop", label: "Seascape" },
    { id: 12, url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop", label: "Forest" },
  ],
};

function getRegionImages(region) {
  return DUMMY_REGION_IMAGES[region] || DUMMY_REGION_IMAGES.default;
}

export default function AddRegion() {
  const { searchMasterCountry, searchMasterRegionOnly } = useCommonHooks();
  const { fetchRegionImages, addRegion } = useRegionHooks()
  const isProduction = useSelector((state) => state.user.isProduction)

  const [countryLoading, setCountryLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    country: "",
    masterRegionId: "",
    description: "",
    min_margin: "",
    max_margin: "",
    region_images: [],
  });

  const [countryInput, setCountryInput] = useState("");
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const [regionImages, setRegionImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [errors, setErrors] = useState({});
  const clearError = (field) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const dropdownRef = useRef(null);
  const countryRef = useRef(null);

  // Country search suggestion
  const fetchCountries = async (val) => {
    try {
      setCountryLoading(true)
      const response = await searchMasterCountry(val)
      setCountrySuggestions(response?.data?.searchedMasterCountries);
      setCountryLoading(false)
    }
    catch (error) {
      setCountryLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }

  }

  // Country search suggestion
  const fetchRegions = async (countryName) => {
    try {
      const response = await searchMasterRegionOnly(countryName)
      setRegions(response?.data?.searchedMasterRegionsOnly);
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

  }

  // For country search
  useEffect(() => {
    if (countryInput.trim().length < 1) {
      setCountrySuggestions([]);
      return;
    }


    if (form?.country !== "") {
      return
    }

    fetchCountries(countryInput)
  }, [countryInput]);

  // For Region Search
  useEffect(() => {
    if (form?.country === "") {
      return;
    }
    fetchRegions(form?.country)
  }, [form?.country]);

  const fetchImages = async (masterRegionId) => {
    try {
      const response = await fetchRegionImages(masterRegionId)
      setRegionImages(response?.data?.regionsImages?.images)
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
  }

  // For fetching images
  useEffect(() => {
    if (form?.masterRegionId === "") {
      return;
    }
    fetchImages(form?.masterRegionId)

  }, [form?.masterRegionId])



  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRegionDropdownOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setCountrySuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryInput(country);
    setCountrySuggestions([]);
    setSelectedRegion("");
    setRegionImages([]);
    setSelectedImages([]);
    setForm((f) => ({ ...f, country, name: "" }));
    clearError("country")
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region?.name);
    setRegionDropdownOpen(false);
    setRegionSearch("");
    setForm((f) => ({ ...f, name: region?.name }));
    setForm((f) => ({ ...f, masterRegionId: region?._id }));
    clearError("region")
  };

  const toggleImage = (img) => {
    setSelectedImages((prev) => {
      const exists = prev.find((i) => i._id === img._id);
      const updated = exists ? prev.filter((i) => i._id !== img._id) : [...prev, img];
      setForm((f) => ({ ...f, region_images: updated.map((i) => i.url) }));
      return updated;
    });
  };

  const filteredRegions = regions?.filter((r) =>
    r?.name.toLowerCase().includes(regionSearch?.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!selectedCountry) e.country = "Please select a country.";
    if (!selectedRegion) e.region = "Please select a region.";
    if (form.min_margin === "") e.min_margin = "Minimum margin is required.";
    if (form.max_margin === "") e.max_margin = "Maximum margin is required.";
    if (form.min_margin !== "" && form.max_margin !== "") {
      if (parseFloat(form.max_margin) <= parseFloat(form.min_margin)) {
        e.max_margin = "Max margin must be greater than min margin.";
      }
    }
    return e;
  };

  const handleSubmit = async () => {
    try {
      const e = validate();
      setErrors(e);
      if (Object.keys(e).length !== 0) {
        return 
      }

      setSubmitLoading(true)
      const response = await addRegion(form)
      toast.success(response?.data?.message)
      setSubmitLoading(false)
    }
    catch (error) {
      setSubmitLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }



  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Region</h1>
        <p className="text-sm text-gray-500 mt-1">Select a country and configure region details</p>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Country Search */}
          <div className="relative" ref={countryRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Country <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={countryInput}
                onChange={(e) => {
                  setCountryInput(e.target.value);
                  setSelectedCountry("");
                  setRegions([]);
                  setSelectedRegion("");
                  setRegionImages([]);
                }}
                placeholder="Search country e.g. India"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                ${errors.country ? "border-red-400 bg-red-50" : selectedCountry ? "border-pink-400 bg-pink-50" : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"}
              `}
              />
              {countryLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="animate-spin h-4 w-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                    />
                  </svg>
                </div>
              )}
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}</div>

            {/* Suggestions */}
            {countrySuggestions?.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {countrySuggestions.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCountrySelect(c)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Region Dropdown with search */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Region <span className="text-pink-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                if (regions?.length > 0) setRegionDropdownOpen((o) => !o);
              }}
              disabled={regions?.length === 0}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-left flex justify-between items-center transition-all outline-none
                ${!selectedCountry ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : ""}
                ${errors?.region ? "border-red-400 bg-red-50" : selectedRegion ? "border-pink-400 bg-pink-50 text-gray-700" : "border-gray-300 text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"}
              `}
            >
              <span>{selectedRegion || (selectedCountry ? "Select a region" : "Select country first")}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${regionDropdownOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {errors?.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}

            {/* Region dropdown */}
            {regionDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    placeholder="Search region..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredRegions.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">No regions found</p>
                  ) : (
                    filteredRegions?.map((r) => (
                      <button
                        key={r?._id}
                        onClick={() => handleRegionSelect(r)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                          ${selectedRegion?.name === r?.name ? "bg-pink-50 text-pink-600 font-medium" : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"}
                        `}
                      >
                        {r?.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description - full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-pink-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Enter a brief description of the region..."
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none resize-none transition-all
                ${errors.description ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"}
              `}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Min Margin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Min Margin (%) <span className="text-pink-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.min_margin}
              onChange={(e) =>{ 
                setForm((f) => ({ ...f, min_margin: e.target.value })) 
                clearError("min_margin")
              }}
              placeholder="e.g. 10"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                ${errors.min_margin ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"}
              `}
            />
            {errors.min_margin && <p className="text-red-500 text-xs mt-1">{errors.min_margin}</p>}
          </div>

          {/* Max Margin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Max Margin (%) <span className="text-pink-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.max_margin}
              onChange={(e) => {setForm((f) => ({ ...f, max_margin: e.target.value }))
                clearError('max_margin')
              }}
              placeholder="e.g. 30"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                ${errors.max_margin ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"}
              `}
            />
            {errors.max_margin && <p className="text-red-500 text-xs mt-1">{errors.max_margin}</p>}
          </div>

        </div>

        {/* Region Images */}
        {form?.masterRegionId && regionImages?.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Region Images</h3>
                <p className="text-xs text-gray-400 mt-0.5">Select images to associate with this region</p>
              </div>
              {selectedImages.length > 0 && (
                <span className="text-xs bg-pink-100 text-pink-600 font-semibold px-2.5 py-1 rounded-full">
                  {selectedImages.length} selected
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {regionImages?.map((img) => {
                const isSelected = selectedImages.some((i) => i._id === img._id);
                return (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() => toggleImage(img)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all group
                      ${isSelected ? "border-pink-500 shadow-md shadow-pink-100" : "border-transparent hover:border-pink-300"}
                    `}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-28 object-cover"
                    />
                    <div className={`absolute inset-0 transition-all ${isSelected ? "bg-pink-500/20" : "bg-transparent group-hover:bg-pink-500/10"}`} />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center shadow">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5">
                      <p className="text-white text-xs font-medium truncate">{img.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="mt-8 flex items-center gap-3">
          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className={`px-6 py-2.5 flex items-center gap-2 bg-pink-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
    ${submitLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-600"}
    `}
          >
            {submitLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                />
              </svg>
            )}

            {submitLoading ? "Adding..." : "Add Region"}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            disabled={submitLoading}
            onClick={() => {
              setForm({ name: "", country: "", description: "", min_margin: "", max_margin: "", region_images: [] });
              setCountryInput("");
              setSelectedCountry("");
              setRegions([]);
              setSelectedRegion("");
              setRegionImages([]);
              setSelectedImages([]);
              setErrors({});
            }}
            className={`px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg transition-colors
    ${submitLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
    `}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}