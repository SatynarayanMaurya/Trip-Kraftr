import { useState } from "react";
import { usePlanHooks } from "../../hooks/usePlanHooks";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
const plans = ["starter", "pro"];

const defaultForm = {
  name: "starter",
  max_departure: 0,
  price_monthly: 0,
  price_yearly: 0,
  max_users: 0,
  max_templates: 0,
  ai_credits_monthly: 0,
  has_hotel_management: false,
  has_vehicle_management: false,
  has_ai_builder: false,
  b2b_trip: false,
  private_trip: false,
  group_trip: true,
};

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
      {label}
    </span>
    <div
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer flex-shrink-0 ${checked ? "bg-amber-400" : "bg-slate-600"
        }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? "left-6" : "left-1"
          }`}
      />
    </div>
  </label>
);

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold tracking-widest uppercase text-slate-400">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
    />
  </div>
);

const SectionLabel = ({ children }) => (
  <label className="text-xs font-semibold tracking-widest uppercase text-amber-400 block mb-3">
    {children}
  </label>
);

export default function CreatePlan() {

  const { createPlan } = usePlanHooks()
  const navigate = useNavigate();
  const isProduction = useSelector((state) => state.user.isProduction)
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const loading = useSelector((state) => state.plan.loading)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createPlan(form);

      setSubmitted(true);
      toast.success(data?.message || "Plan created successfully");

      navigate("/");
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
        "Error in creating the plan"
      );
    }
  };

  return (
    <div
      className="relative  min-h-screen bg-slate-950 flex items-center justify-center p-6 py-4"
      //   style={{ fontFamily: "'Inter', sans-serif" }}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-li-stops))] from-slate-900/50 via-slate-950 to-slate-950" />
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs tracking-widest uppercase text-amber-400 font-semibold">
              Plan Configuration
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Plan</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">

            {/* ── LEFT COLUMN ── */}
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 flex flex-col gap-5">

              {/* Plan Selector */}
              <div>
                <SectionLabel>Plan Type</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {plans.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set("name", p)}
                      className={`relative py-2.5 px-4 rounded-xl border text-sm font-semibold tracking-wide capitalize transition-all duration-200 ${form.name === p
                          ? "border-amber-400 bg-amber-400/10 text-amber-300"
                          : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                        }`}
                    >
                      {p === "pro" && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                          Popular
                        </span>
                      )}
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800" />

              {/* Pricing */}
              <div>
                <SectionLabel>Pricing</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Monthly (₹)"
                    value={form.price_monthly || ""}
                    onChange={(e) => set("price_monthly", Number(e.target.value))}
                    placeholder="e.g. 29"
                  />
                  <InputField
                    label="Yearly (₹)"
                    value={form.price_yearly || ""}
                    onChange={(e) => set("price_yearly", Number(e.target.value))}
                    placeholder="e.g. 290"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800" />

              {/* Limits */}
              <div>
                <SectionLabel>Limits</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Max Departures"
                    value={form.max_departure || ""}
                    onChange={(e) => set("max_departure", Number(e.target.value))}
                    placeholder="e.g. 50"
                  />
                  <InputField
                    label="Max Users"
                    value={form.max_users || ""}
                    onChange={(e) => set("max_users", Number(e.target.value))}
                    placeholder="e.g. 10"
                  />
                  <InputField
                    label="Max Templates"
                    value={form.max_templates || ""}
                    onChange={(e) => set("max_templates", Number(e.target.value))}
                    placeholder="e.g. 20"
                  />
                  <InputField
                    label="AI Credits / Mo"
                    value={form.ai_credits_monthly}
                    onChange={(e) => set("ai_credits_monthly", Number(e.target.value))}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 flex flex-col gap-5">

              {/* Feature Access */}
              <div>
                <SectionLabel>Feature Access</SectionLabel>
                <div className="space-y-4">
                  <Toggle
                    label="Hotel Management"
                    checked={form.has_hotel_management}
                    onChange={() => set("has_hotel_management", !form.has_hotel_management)}
                  />
                  <Toggle
                    label="Vehicle Management"
                    checked={form.has_vehicle_management}
                    onChange={() => set("has_vehicle_management", !form.has_vehicle_management)}
                  />
                  <Toggle
                    label="AI Builder"
                    checked={form.has_ai_builder}
                    onChange={() => set("has_ai_builder", !form.has_ai_builder)}
                  />
                </div>
              </div>

              <div className="border-t border-slate-800" />

              {/* Trip Types */}
              <div>
                <SectionLabel>Trip Types</SectionLabel>
                <div className="space-y-4">
                  <Toggle
                    label="B2B Trip"
                    checked={form.b2b_trip}
                    onChange={() => set("b2b_trip", !form.b2b_trip)}
                  />
                  <Toggle
                    label="Private Trip"
                    checked={form.private_trip}
                    onChange={() => set("private_trip", !form.private_trip)}
                  />
                  <Toggle
                    label="Group Trip"
                    checked={form.group_trip}
                    onChange={() => set("group_trip", !form.group_trip)}
                  />
                </div>
              </div>

              <div className="border-t border-slate-800" />

              {/* Live Summary */}
              <div>
                <SectionLabel>Summary</SectionLabel>
                <div className="bg-slate-800/50 rounded-xl p-4 space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Plan</span>
                    <span className="text-amber-300 capitalize font-semibold">{form.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pricing</span>
                    <span className="text-white">₹{form.price_monthly}/mo · ₹{form.price_yearly}/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limits</span>
                    <span className="text-white">{form.max_users} users · {form.max_departure} departures</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Templates</span>
                    <span className="text-white">{form.max_templates} templates · {form.ai_credits_monthly} AI credits</span>
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              {/* Submit */}
              {/* <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                  submitted
                    ? "bg-green-500 text-white"
                    : "bg-amber-400 hover:bg-amber-300 text-slate-900"
                }`}
              >
                {submitted
                  ? "✓ Plan Saved"
                  : `Save ${form.name.charAt(0).toUpperCase() + form.name.slice(1)} Plan`}
              </button> */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2
                  ${loading
                    ? "bg-amber-400 text-slate-900 opacity-80 cursor-not-allowed"
                    : submitted
                      ? "bg-green-500 text-white"
                      : "bg-amber-400 hover:bg-amber-300 text-slate-900"
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
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
                    Saving Plan...
                  </>
                ) : submitted ? (
                  <>✓ Plan Saved</>
                ) : (
                  <>
                    Save {form.name.charAt(0).toUpperCase() + form.name.slice(1)} Plan
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}