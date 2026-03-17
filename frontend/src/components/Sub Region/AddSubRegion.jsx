import { useState, useRef, useEffect } from "react";
import { useCommonHooks } from "../../hooks/useCommonHooks";
// import { useSubRegionHooks } from "../../hooks/useSubRegionHooks"; // update when real hook is ready
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSubRegionHooks } from "../../hooks/useSubRegionHooks";

export default function AddSubRegion() {
  const { searchMasterCountry,searchRegionForOrg } = useCommonHooks(); // reusing for region search until real hook ready
  const { addSubRegion } = useSubRegionHooks() // safe call — swap with real hook later
  const isProduction = useSelector((state) => state.user.isProduction);
  const navigate = useNavigate();

  const [regionLoading, setRegionLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [regionInput, setRegionInput] = useState("");
  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null); // { _id, name }

  const [form, setForm] = useState({
    regionId: "",
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const regionRef = useRef(null);

  const clearError = (field) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  // Fetch region suggestions (reusing searchMasterCountry until real API ready)
  const fetchRegions = async (val) => {
    try {
      setRegionLoading(true);
      const response = await searchRegionForOrg(val); // swap with real region search hook later
      setRegionSuggestions(response?.data?.searchedRegions ?? []);
    } catch (error) {
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(
        error?.response?.data?.message || error?.message || "Error fetching regions"
      );
    } finally {
      setRegionLoading(false);
    }
  };

  useEffect(() => {
    if (regionInput.trim().length < 1) {
      setRegionSuggestions([]);
      return;
    }
    // Don't re-fetch if a region is already selected and input matches its name
    if (selectedRegion && regionInput === selectedRegion.name) return;
    fetchRegions(regionInput);
  }, [regionInput]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (regionRef.current && !regionRef.current.contains(e.target)) {
        setRegionSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRegionSelect = (region) => {
    setSelectedRegion({ _id: region?._id, name: region?.name });
    setRegionInput(region?.name);
    setRegionSuggestions([]);
    setForm((f) => ({ ...f, regionId: region?._id, name: "", description: "" }));
    clearError("region");
  };

  const validate = () => {
    const e = {};
    if (!selectedRegion) e.region = "Please select a region.";
    if (!form.name.trim()) e.name = "Sub-region name is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length !== 0) return;

    try {
      setSubmitLoading(true);
      const response = await addSubRegion(form);
      toast.success(response?.data?.message || "Sub-region added successfully");
      navigate(-1);
    } catch (error) {
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error adding sub-region"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ regionId: "", name: "", description: "" });
    setRegionInput("");
    setSelectedRegion(null);
    setRegionSuggestions([]);
    setErrors({});
  };

  const isRegionSelected = !!selectedRegion;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Sub-Region</h1>
        <p className="text-sm text-gray-500 mt-1">
          Search and select a region, then configure sub-region details
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Region Search — full width */}
          <div className="md:col-span-2 relative" ref={regionRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Region <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={regionInput}
                onChange={(e) => {
                  setRegionInput(e.target.value);
                  setSelectedRegion(null);
                  setForm((f) => ({ ...f, regionId: "", name: "", description: "" }));
                }}
                placeholder="Search region e.g. Himalaya"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                  ${errors.region
                    ? "border-red-400 bg-red-50"
                    : isRegionSelected
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  }`}
              />
              {/* Loading spinner */}
              {regionLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-pink-500" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="3" fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                    />
                  </svg>
                </div>
              )}
              {/* Selected badge */}
              {isRegionSelected && !regionLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            {errors.region && (
              <p className="text-red-500 text-xs mt-1">{errors.region}</p>
            )}

            {/* Suggestions dropdown */}
            {regionSuggestions?.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {regionSuggestions?.map((r) => (
                  <button
                    key={r?._id}
                    onClick={() => handleRegionSelect(r)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  >
                    {r?.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sub-Region Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Sub-Region Name <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              disabled={!isRegionSelected}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                clearError("name");
              }}
              placeholder={isRegionSelected ? "Enter sub-region name" : "Select a region first"}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                ${!isRegionSelected
                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  : errors.name
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Spacer on md+ so description goes full width below */}
          <div className="hidden md:block" />

          {/* Description — full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea
              value={form.description}
              disabled={!isRegionSelected}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder={
                isRegionSelected
                  ? "Enter a brief description of the sub-region..."
                  : "Select a region first"
              }
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none resize-none transition-all
                ${!isRegionSelected
                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                }`}
            />
          </div>
        </div>

        {/* Info pill — visible when region selected */}
        {isRegionSelected && (
          <div className="mt-6 flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-pink-600">
              Adding sub-region under{" "}
              <span className="font-semibold">{selectedRegion.name}</span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className={`px-6 py-2.5 flex items-center gap-2 bg-pink-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
              ${submitLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-pink-600"}`}
          >
            {submitLoading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="3" fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                />
              </svg>
            )}
            {submitLoading ? "Adding..." : "Add Sub-Region"}
          </button>

          <button
            type="button"
            disabled={submitLoading}
            onClick={handleReset}
            className={`px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg transition-colors
              ${submitLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}