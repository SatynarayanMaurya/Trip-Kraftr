import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRegionHooks } from "../../hooks/useRegionHooks";
import { toast } from "react-toastify";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function AddRegion() {
  const [form, setForm] = useState({
    name: "",
    country: "india",
    description: "",
    min_margin: "",
    max_margin: "",
  });

  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loading = useSelector((state)=>state.user.loading)
  const navigate = useNavigate()
  const isProduction = useSelector((state)=>state.user.isProduction)
  const {addRegion} = useRegionHooks()

  const filtered = INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Please select a region (state).";
    if (form.min_margin === "") newErrors.min_margin = "Min margin is required.";
    if (form.max_margin === "") newErrors.max_margin = "Max margin is required.";
    if (
      form.min_margin !== "" &&
      form.max_margin !== "" &&
      parseFloat(form.min_margin) > parseFloat(form.max_margin)
    ) {
      newErrors.min_margin = "Min margin cannot be greater than max margin.";
    }
    return newErrors;
  };

  const handleSubmit =async () => {
    try{
        const errs = validate();
        if (Object.keys(errs).length > 0) {
          setErrors(errs);
          return;
        }
        console.log("Form data : ",form)
        // const res = await addRegion(form)
        // toast.success(res?.data?.message)

        setErrors({});

    }
    catch(error){
        if (!isProduction) {
          console.log("========= ERROR DEBUG START =========");
          console.log("Error:", error);
          console.log("Response:", error?.response);
          console.log("========= ERROR DEBUG END =========");
        }
        toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
  };

  const handleReset = () => {
    setForm({ name: "", country: "india", description: "", min_margin: "", max_margin: "" });
    setQuery("");
    setErrors({});
  };

  const inputBase =
    "w-full bg-[#0d1117] border border-[#2a2f3e] rounded-lg px-4 py-3 text-white placeholder-[#4a5068] text-sm focus:outline-none focus:border-[#f5a623] transition-colors duration-200";

  const labelBase = "block text-[10px] font-bold tracking-widest text-[#f5a623] uppercase mb-2";

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#f5a623]" style={{animation: "pulse 2s infinite"}}></span>
            <span className="text-[10px] font-bold tracking-widest text-[#f5a623] uppercase">
              Region Configuration
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Add Region</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 mt-4 hover:text-[#b0b3b8] cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to List
          </button>
        </div>

        {/* Card */}
        <div className="bg-[#0d1320] border border-[#1e2436] rounded-2xl p-8 shadow-2xl">

          {/* Row: Name + Country */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* State Searchable Dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className={labelBase}>Region Name (State)</label>
              <div
                className={`relative cursor-pointer ${inputBase} flex items-center justify-between ${
                  errors.name ? "border-red-500" : ""
                }`}
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <span className={form.name ? "text-white" : "text-[#4a5068]"}>
                  {form.name || "Select a state..."}
                </span>
                <svg
                  className={`w-4 h-4 text-[#f5a623] transition-transform duration-200 shrink-0 ml-2 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {dropdownOpen && (
                <div className="absolute z-50 mt-2 w-full bg-[#0d1320] border border-[#2a2f3e] rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-2 border-b border-[#1e2436]">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search state..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-[#080c14] border border-[#2a2f3e] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4a5068] focus:outline-none focus:border-[#f5a623] transition-colors"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto hide_scrollbar">
                    {filtered.length === 0 ? (
                      <div className="px-4 py-3 text-[#4a5068] text-sm">No states found</div>
                    ) : (
                      filtered.map((state) => (
                        <div
                          key={state}
                          onClick={() => {
                            setForm((f) => ({ ...f, name: state }));
                            setQuery("");
                            setDropdownOpen(false);
                            setErrors((e) => ({ ...e, name: "" }));
                          }}
                          className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 ${
                            form.name === state
                              ? "bg-[#f5a623] bg-opacity-20 text-white font-medium"
                              : "text-[#c0c8e0] hover:bg-[#1e2436] hover:text-white"
                          }`}
                        >
                          {state}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {errors.name && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Country - Static */}
            <div>
              <label className={labelBase}>Country</label>
              <div
                className={`${inputBase} flex items-center gap-2 cursor-not-allowed select-none`}
                style={{ opacity: 0.6 }}
              >
                <span className="text-lg">🇮🇳</span>
                <span className="text-white">India</span>
              </div>
              <p className="mt-1.5 text-[#4a5068] text-xs">Fixed — cannot be changed.</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className={labelBase}>Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of the region..."
              value={form.description}
              onChange={(e) => {
                setForm((f) => ({ ...f, description: e.target.value }));
                setErrors((e2) => ({ ...e2, description: "" }));
              }}
              className={`${inputBase} resize-none ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="mt-1.5 text-red-400 text-xs">{errors.description}</p>
            )}
          </div>

          {/* Margins */}
          <div className="mb-8">
            <label className={labelBase}>Margin Limits (%)</label>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    min="0"
                    value={form.min_margin}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, min_margin: e.target.value }));
                      setErrors((e2) => ({ ...e2, min_margin: "" }));
                    }}
                    className={`${inputBase} pr-12 ${errors.min_margin ? "border-red-500" : ""}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5068] text-[10px] font-bold tracking-wider">MIN</span>
                </div>
                {errors.min_margin && (
                  <p className="mt-1.5 text-red-400 text-xs">{errors.min_margin}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    min="0"
                    value={form.max_margin}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, max_margin: e.target.value }));
                      setErrors((e2) => ({ ...e2, max_margin: "" }));
                    }}
                    className={`${inputBase} pr-12 ${errors.max_margin ? "border-red-500" : ""}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5068] text-[10px] font-bold tracking-wider">MAX</span>
                </div>
                {errors.max_margin && (
                  <p className="mt-1.5 text-red-400 text-xs">{errors.max_margin}</p>
                )}
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-[#1e2436] mb-6" />

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl bg-yellow-400 py-3.5 text-sm font-black uppercase tracking-wider text-black shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ boxShadow: "0 4px 20px rgba(245,166,35,0.25)" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5b84a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f5a623"}
            >
                {!loading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    `Save Region`
                )}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3.5 rounded-xl border border-[#2a2f3e] text-[#7a8099] hover:text-white hover:border-[#4a5068] text-sm font-medium transition-all duration-200"
            >
              Reset
            </button>
          </div>

          {/* {submitted && (
            <div className="mt-4 bg-[#0d2a1a] border border-[#1a5c38] rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <p className="text-green-400 text-sm font-semibold">Region added successfully!</p>
                <p className="text-[#4a7a5a] text-xs">{form.name}, {form.country}</p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}