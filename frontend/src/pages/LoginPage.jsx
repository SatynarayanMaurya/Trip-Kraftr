import { useState } from "react";
import { toast } from "react-toastify";
import { apiConnector } from "../services/apiConnector";
import { authEndpoints } from "../services/Apis/authApis";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [role, setRole] = useState("staff");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length > 10) {
      setPhoneError("Phone number cannot exceed 10 digits.");
    } else {
      setPhoneError("");
    }
    setPhone(val.slice(0, 10));
  };

  const handleSubmit = async(e) => {
    try{
      e.preventDefault();
      if (phone.length < 10) {
        setPhoneError("Please enter a valid 10-digit phone number.");
        return;
      }
      if(!phone || !password){
        toast.warn("Please provide the required field")
        return ;
      }
      setIsLoading(true)
      const response = await apiConnector("POST",authEndpoints.LOGIN,{role,phone,password})
      setIsLoading(false)
      toast.success(response?.data?.message)
      localStorage.setItem("token",response?.data?.token)
      navigate("/")
    }
    catch(error){
      setIsLoading(false)
      console.log("Error in login : ",error)
      toast.error(error?.response?.data?.message || error?.message || "Error in login")
    }

  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[540px]">

        {/* Left Image Panel */}
        <div className="relative md:w-1/2 w-full h-56 md:h-auto shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700" />
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-white/10 rounded-full" />
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-12 text-white text-center">
            {/* Icon */}
            <div className="mb-6 bg-white/20 rounded-2xl p-5 backdrop-blur-sm">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              Welcome Back
            </h1>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs">
              Sign in to your account and pick up right where you left off. Your workspace is waiting.
            </p>
            <div className="mt-8 flex gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`block rounded-full ${i === 0 ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:w-1/2 w-full flex flex-col justify-center px-8 py-10 md:px-12">
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                  Sign In
                </h2>
                <p className="text-slate-400 text-sm">Choose your account type to continue</p>
              </div>

              {/* Role Selector */}
              <div className="flex gap-3 mb-8">
                {["staff", "customer"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer
                      ${role === r
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                      ${role === r ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}>
                      {role === r && <span className="w-1.5 h-1.5 bg-white rounded-full block" />}
                    </span>
                    <span className="capitalize">{r}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
                    <div className="absolute left-[52px] top-1/2 -translate-y-1/2 h-4 w-px bg-slate-200" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      required
                      className={`w-full pl-16 pr-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-300 outline-none transition-all
                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                        ${phoneError ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono">
                      {phone.length}/10
                    </span>
                  </div>
                  {phoneError && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {phoneError}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 text-sm text-slate-800 placeholder-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In as <span className="capitalize">{role}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

            </>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;