import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useOrganizationHooks } from "../../hooks/useOrganizationHooks";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { addNewOrganization } from "../../redux/slices/organizationSlice";

export default function AddOrganization() {
  const [form, setForm] = useState({
    plan: "starter",
    name: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    gst: "",
    logo: null,
    address: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const isProduction = useSelector((state) => state.user.isProduction);
  const { addOrganization } = useOrganizationHooks();
  const loading = useSelector((state) => state.user.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm((prev) => ({ ...prev, logo: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "primaryPhone" || name === "secondaryPhone") {
      setForm((prev) => ({ ...prev, [name]: value.slice(0, 10) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Basic validation
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Organization name is required";
    if (!form.primaryPhone.trim())
      newErrors.primaryPhone = "Primary phone is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    const { subscriptionStartDate, subscriptionEndDate } = form;

    // Subscription date validation
    if (
      (subscriptionStartDate && !subscriptionEndDate) ||
      (!subscriptionStartDate && subscriptionEndDate)
    ) {
      validationErrors.subscriptionDates =
        "Both subscription start and end dates must be provided together.";
    } else if (subscriptionStartDate && subscriptionEndDate) {
      const start = new Date(subscriptionStartDate);
      const end = new Date(subscriptionEndDate);
      if (end <= start) {
        validationErrors.subscriptionDates =
          "Subscription end date must be after start date.";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const data = await addOrganization(form);
      toast?.success(
        data?.message || "Organization created successfully"
      );
      dispatch(addNewOrganization(data?.newOrganization))
      setErrors({});
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
          "Error in adding the organization"
      );
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-white placeholder-slate-500 bg-[#0f1623] transition focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
      errors[field] ? "border-red-500" : "border-[#1e2a3a]"
    }`;

  const sectionLabel =
    "text-xs font-bold uppercase tracking-widest text-yellow-400 mb-4";
  const fieldLabel =
    "block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5";

  return (
    <div
      className="min-h-screen bg-[#0a0f1a] p-6 md:p-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4) sepia(1) saturate(3) hue-rotate(5deg); }
      `}</style>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              Organization Configuration
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Add Organization</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 mt-2 hover:text-[#b0b3b8] cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Plan Type */}
              <div className="rounded-2xl border border-[#1e2a3a] bg-[#0d1420] p-6">
                <p className={sectionLabel}>Plan Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {["starter", "pro"].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, plan }))
                      }
                      className={`relative rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                        form.plan === plan
                          ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/25"
                          : "border border-[#1e2a3a] bg-[#0f1623] text-white hover:border-yellow-400/40"
                      }`}
                    >
                      {plan === "pro" && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black">
                          Popular
                        </span>
                      )}
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organization Info */}
              <div className="rounded-2xl border border-[#1e2a3a] bg-[#0d1420] p-6">
                <p className={sectionLabel}>Organization Info</p>
                <div className="space-y-4">
                  <div>
                    <label className={fieldLabel}>Organization Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Acme Corp"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={fieldLabel}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. org@example.com"
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={fieldLabel}>Primary Phone</label>
                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        name="primaryPhone"
                        value={form.primaryPhone}
                        onChange={handleChange}
                        placeholder="e.g. 98765 43210"
                        className={inputClass("primaryPhone")}
                      />
                      {errors.primaryPhone && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.primaryPhone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={fieldLabel}>Secondary Phone</label>
                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        name="secondaryPhone"
                        value={form.secondaryPhone}
                        onChange={handleChange}
                        placeholder="e.g. 98765 43211"
                        className={inputClass("secondaryPhone")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={fieldLabel}>GST Number</label>
                    <input
                      type="text"
                      name="gst"
                      value={form.gst}
                      onChange={handleChange}
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      className={inputClass("gst")}
                    />
                  </div>

                  <div>
                    <label className={fieldLabel}>Address</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={5}
                      placeholder="e.g. 123 Main Street, City, State - 000000"
                      className={`${inputClass("address")} resize-none`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Subscription Dates */}
              <div className="rounded-2xl border border-[#1e2a3a] bg-[#0d1420] p-6">
                <p className={sectionLabel}>Subscription Period</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={fieldLabel}>Start Date</label>
                    <input
                      type="date"
                      name="subscriptionStartDate"
                      value={form.subscriptionStartDate}
                      onChange={handleChange}
                      className={inputClass("subscriptionStartDate")}
                    />
                  </div>
                  <div>
                    <label className={fieldLabel}>End Date</label>
                    <input
                      type="date"
                      name="subscriptionEndDate"
                      value={form.subscriptionEndDate}
                      onChange={handleChange}
                      className={inputClass("subscriptionEndDate")}
                    />
                  </div>
                </div>
                {errors.subscriptionDates && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.subscriptionDates}
                  </p>
                )}
              </div>

              {/* Branding & Status */}
              <div className="rounded-2xl border border-[#1e2a3a] bg-[#0d1420] p-6">
                <p className={sectionLabel}>Branding & Status</p>
                <div className="space-y-5">
                  {/* Logo Upload */}
                  <div>
                    <label className={fieldLabel}>Logo</label>
                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#1e2a3a] bg-[#0f1623] px-4 py-4 transition hover:border-yellow-400/50 hover:bg-yellow-400/5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1e2a3a] overflow-hidden">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="preview"
                            className="h-12 w-12 object-cover"
                          />
                        ) : (
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {form.logo ? form.logo.name : "Upload Organization Logo"}
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, SVG up to 2MB
                        </p>
                      </div>
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setForm((p) => ({ ...p, logo: null }));
                        }}
                        className="mt-2 text-xs text-red-400 hover:text-red-300 transition"
                      >
                        × Remove logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-[#1e2a3a] bg-[#0d1420] p-6">
                <p className={sectionLabel}>Summary</p>
                <div className="space-y-3">
                  {[
                    { label: "Plan", value: form.plan || "—", highlight: true },
                    { label: "Organization", value: form.name || "—" },
                    { label: "Email", value: form.email || "—" },
                    {
                      label: "Subscription",
                      value:
                        form.subscriptionStartDate && form.subscriptionEndDate
                          ? `${form.subscriptionStartDate} → ${form.subscriptionEndDate}`
                          : "—",
                    },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span
                        className={`text-sm font-semibold truncate ml-4 max-w-[60%] text-right ${
                          highlight ? "text-yellow-400" : "text-white"
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* Submit Button with Loading */}
                <button
                  type="submit"
                  disabled={loading} // disable while loading
                  className="w-full rounded-xl bg-yellow-400 py-3.5 text-sm font-black uppercase tracking-wider text-black shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
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
                    `Save ${form.plan} Organization`
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={()=>navigate(-1)}
                  disabled={loading} // optionally disable cancel while saving
                  className="w-full rounded-xl border border-[#1e2a3a] bg-transparent py-3 text-sm font-semibold text-slate-400 transition hover:border-slate-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}