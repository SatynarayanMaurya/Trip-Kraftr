import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRegionHooks } from '../../hooks/useRegionHooks';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { usePolicyHooks } from '../../hooks/usePolicyHooks';

const BLUE = "#18305C";
const PINK = "#ED5F8D";

const policyCategory = ["Cancellation", "Payment", "Inclusion", "Exclusion", "Things To Pack"];

function AddPolicy() {
    const {addPolicy} = usePolicyHooks()
    const { getRegionsForOrg } = useRegionHooks();
    const allRegionsForSuggestions = useSelector((state) => state.user.allRegionsForSuggestions);
    const isProduction = useSelector((state) => state.user.isProduction);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        regionId: "",
        regionName: "",
        policyCategory: "",
        policies: [""], // start with one empty policy textarea
    });

    const [errors, setErrors] = useState({});
    const [regionLoading, setRegionLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // ─── Fetch regions ────────────────────────────────────────────────────────
    const fetchRegionsForSuggestion = async () => {
        try {
            if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
            setRegionLoading(true);
            await getRegionsForOrg();
            setRegionLoading(false);
        } catch (error) {
            setRegionLoading(false);
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Error fetching regions"
            );
        }
    };

    useEffect(() => {
        if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
        fetchRegionsForSuggestion();
    }, []);

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleRegionChange = (e) => {
        const { value } = e.target;
        const matched = allRegionsForSuggestions?.find((r) => r?.name === value);
        setFormData((prev) => ({
            ...prev,
            regionId: matched?._id || "",
            regionName: value,
        }));
        if (errors.regionId) setErrors((prev) => ({ ...prev, regionId: "" }));
    };

    const handlePolicyCategoryChange = (e) => {
        setFormData((prev) => ({ ...prev, policyCategory: e.target.value }));
        if (errors.policyCategory) setErrors((prev) => ({ ...prev, policyCategory: "" }));
    };

    const handlePolicyChange = (index, value) => {
        const updated = [...formData.policies];
        updated[index] = value;
        setFormData((prev) => ({ ...prev, policies: updated }));
        if (errors.policies) setErrors((prev) => ({ ...prev, policies: "" }));
    };

    const handleAddPolicy = () => {
        setFormData((prev) => ({ ...prev, policies: [...prev.policies, ""] }));
    };

    const handleRemovePolicy = (index) => {
        if (formData.policies.length === 1) return; // keep at least one
        const updated = formData.policies.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, policies: updated }));
    };

    // ─── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const newErrors = {};
        if (!formData.regionId) newErrors.regionId = "Region is required";
        if (!formData.policyCategory) newErrors.policyType = "Policy category is required";
        const hasAtLeastOne = formData.policies?.some((p) => p?.trim()?.length > 0);
        if (!hasAtLeastOne) newErrors.policies = "At least one policy detail is required";
        return newErrors;
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const payload = {
                regionId: formData.regionId,
                regionName: formData.regionName,
                policyCategory: formData.policyCategory,
                policies: formData.policies?.filter((p) => p?.trim()?.length > 0),
            };

            setSubmitLoading(true)
            const response = await addPolicy(payload)
            toast.success(response?.data?.message)
            setSubmitLoading(false)
            navigate(-1)
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

    // ─── UI ───────────────────────────────────────────────────────────────────
    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl text-white transition-opacity hover:opacity-90 shrink-0"
                    style={{ backgroundColor: PINK }}
                >
                    <ArrowLeft size={17} strokeWidth={2.5} />
                </button>
                <h1 className="text-2xl font-bold" style={{ color: BLUE }}>
                    Add New Policy
                </h1>
            </div>

            {/* Form Card */}
            <div
                className="bg-white rounded-2xl p-8 max-w-4xl"
                style={{ boxShadow: "0 4px 24px rgba(24,48,92,0.10)" }}
            >
                <form onSubmit={handleSubmit}>

                    {/* Row 1 — Region & Policy Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        {/* Region Name */}
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: BLUE }}>
                                Region Name <span style={{ color: PINK }}>*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.regionName}
                                    onChange={handleRegionChange}
                                    className={`w-full appearance-none px-4 py-2.5 pr-10 border rounded-xl text-sm bg-white focus:outline-none transition-all ${errors.regionId
                                            ? "border-red-400 ring-1 ring-red-300"
                                            : "border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                                        }`}
                                    style={{ color: formData.regionName ? BLUE : "#9ca3af" }}
                                >
                                    <option value="" disabled>Select Region</option>
                                    {allRegionsForSuggestions?.map((r) => (
                                        <option key={r?._id} value={r?.name} style={{ color: BLUE }}>
                                            {r?.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    {regionLoading ? (
                                        <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {errors.regionId && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.regionId}</p>
                            )}
                        </div>

                        {/* Policy Category */}
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: BLUE }}>
                                Policy Category <span style={{ color: PINK }}>*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.policyCategory}
                                    onChange={handlePolicyCategoryChange}
                                    className={`w-full appearance-none px-4 py-2.5 pr-10 border rounded-xl text-sm bg-white focus:outline-none transition-all ${errors.policyType
                                            ? "border-red-400 ring-1 ring-red-300"
                                            : "border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                                        }`}
                                    style={{ color: formData.policyCategory ? BLUE : "#9ca3af" }}
                                >
                                    <option value="" disabled>Select Policy Category</option>
                                    {policyCategory?.map((type) => (
                                        <option key={type} value={type} style={{ color: BLUE }}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.policyType && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.policyType}</p>
                            )}
                        </div>
                    </div>

                    {/* Policy Entries */}
                    <div className="space-y-5">
                        {formData.policies?.map((policy, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-bold" style={{ color: BLUE }}>
                                        Policy Details
                                        {formData.policies.length > 1 && (
                                            <span className="ml-1.5 text-xs font-semibold text-gray-400">
                                                #{index + 1}
                                            </span>
                                        )}
                                    </label>
                                    {/* Remove button — only show when more than one policy */}
                                    {formData.policies.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePolicy(index)}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <textarea
                                    rows={1}
                                    value={policy}
                                    onChange={(e) => handlePolicyChange(index, e.target.value)}
                                    placeholder="Enter policy details here..."
                                    className={`w-full px-4 py-3 border rounded-xl text-sm resize-none focus:outline-none transition-all ${errors.policies && index === 0
                                            ? "border-red-400 ring-1 ring-red-300"
                                            : "border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                                        }`}
                                    style={{ color: BLUE }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Policies error */}
                    {errors.policies && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.policies}</p>
                    )}

                    {/* Add Another Policy */}
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleAddPolicy}
                            className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
                            style={{ color: PINK }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Another Policy
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 mt-8 pt-6">
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={submitLoading}
                                onClick={() => navigate(-1)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className={`flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition-all ${submitLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                                    }`}
                                style={{
                                    backgroundColor: PINK,
                                    boxShadow: "0 4px 14px rgba(250,56,119,0.30)"
                                }}
                            >
                                {submitLoading ? (
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                                    </svg>
                                ) : (
                                    <Save size={15} />
                                )}
                                {submitLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddPolicy;