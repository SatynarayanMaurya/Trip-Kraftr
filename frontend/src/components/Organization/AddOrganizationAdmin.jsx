import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BuildingIcon,UserIcon,PhoneIcon,LockIcon,ShieldIcon,ChevronDown } from "../Icons/Icons";
import { toast } from "react-toastify";
import { useOrganizationHooks } from "../../hooks/useOrganizationHooks";
import { setLoading } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const EyeIcon = ({ show }) =>
  show ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.228-3.592M6.228 6.228A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.293 5.411M3 3l18 18" />
    </svg>
  );








const Field = ({ label, required, error, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-400">{error}</p>}
    {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
  </div>
);

const inputBase =
  "w-full bg-[#111827] border rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all";
const inputNormal = `${inputBase} border-[#2a3448] focus:border-[#f5a623]/60 focus:ring-1 focus:ring-[#f5a623]/20`;
const inputError  = `${inputBase} border-red-500/60`;

export default function AddOrganizationAdmin() {
  const [form, setForm] = useState({
    org_id: "", name: "", phone: "", password: "", role: "org_admin",
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allOrganizations = useSelector((state)=>state.organization.allOrganizations)
  const isProduction = useSelector((state)=>state.user.isProduction)
  const {getAllOrganizationForSuperAdmin, addOrganizationAdmin} = useOrganizationHooks()
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const loading = useSelector((state)=>state.user.loading)

  const fetchAllOrganization = async ()=>{
    try{
      if(allOrganizations && allOrganizations?.length > 0) return;
      await getAllOrganizationForSuperAdmin()
    }
    catch(error){
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in getting all the organization")
    }
  }
  useEffect(()=>{
    fetchAllOrganization()
  },[])

  const validate = () => {
    const e = {};
    if (!form.org_id) e.org_id = "Please select an organization.";
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    return e;
  };

  const handleChange = (e) => {
    if(loading) return
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      // console.log("Form : ",form)
      const res = await addOrganizationAdmin(form)
      toast.success(res?.data?.message)
      navigate("/organizations")

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
    setForm({ org_id: "", name: "", phone: "", password: "", role: "org_admin" });
    setErrors({});
    setSubmitted(false);
  };

  const selectedOrg = allOrganizations.find((o) => o._id === form.org_id);

  return (
    <div className="min-h-screen bg-[#0f1623] text-white p-6 md:p-10">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">Management</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Add Org Admin</h1>
        <p className="text-gray-400 text-sm mt-1">Assign an administrator to an existing organization</p>
      </div>

      {/* ── Success State ── */}

      /* ── Form Card ── */
      <div className="max-w-3xl mx-auto">
          <div className="bg-[#1a2235] border border-[#2a3448] rounded-2xl overflow-hidden">

            {/* Card Header */}
            <div className="px-6 py-5 border-b border-[#2a3448] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f5a623]/10 flex items-center justify-center border border-[#f5a623]/20">
                <ShieldIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Organization Admin Details</p>
                <p className="text-xs text-gray-500">All fields marked * are required</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

              {/* Row 1 — Organization full width */}
              <Field label="Organization" required error={errors.org_id}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <BuildingIcon />
                  </span>
                  <select
                    name="org_id"
                    value={form.org_id}
                    onChange={handleChange}
                    className={`${errors.org_id ? inputError : inputNormal} appearance-none cursor-pointer pr-10`}
                  >
                    <option value="" disabled className="text-gray-500">Select an organization</option>
                    {allOrganizations.map((org) => (
                      <option key={org._id} value={org._id} className="text-white bg-[#1a2235]">
                        {org.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <ChevronDown />
                  </span>
                </div>
                {form.org_id && !errors.org_id && (
                  <p className="text-xs text-green-400 flex items-center gap-1 -mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    {selectedOrg?.name} selected
                  </p>
                )}
              </Field>

              {/* Row 2 — Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Admin Name" required error={errors.name}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className={errors.name ? inputError : inputNormal}
                    />
                  </div>
                </Field>

                <Field label="Phone Number" required error={errors.phone}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <PhoneIcon />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      maxLength={10}
                      className={errors.phone ? inputError : inputNormal}
                    />
                  </div>
                </Field>
              </div>

              {/* Row 3 — Password + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <LockIcon />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className={`${errors.password ? inputError : inputNormal} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                </Field>

                <Field label="Role" hint="Automatically set to org_admin">
                  <div className="flex items-center gap-3 bg-[#111827] border border-[#2a3448] rounded-xl px-4 py-3 h-[46px]">
                    <span className="text-gray-500"><ShieldIcon /></span>
                    <span className="text-sm text-white font-medium">Organization Admin</span>
                    <span className="ml-auto px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                      Fixed
                    </span>
                  </div>
                </Field>
              </div>

              {/* Divider */}
              <div className="border-t border-[#2a3448]" />

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl border border-[#2a3448] text-gray-400 hover:text-white hover:border-[#3a4458] text-sm font-medium transition-all"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-[#f5a623] hover:bg-[#e09615] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Adding Admin...
                    </>
                  ) : (
                    "+ Add Org Admin"
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-4 text-xs text-gray-600 text-center">
            The admin will receive credentials via phone or email after creation.
          </p>
      </div>
      
    </div>
  );
}