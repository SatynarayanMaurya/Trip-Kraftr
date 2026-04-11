import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlaceHooks } from '../../hooks/usePlaceHooks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegionHooks } from '../../hooks/useRegionHooks';
import { useSubRegionHooks } from '../../hooks/useSubRegionHooks';
import { Save, ArrowLeft } from 'lucide-react';

function UpdatePlace() {
    const { getPlaceById,updatePlaceById } = usePlaceHooks();
    const { getRegionsForOrg } = useRegionHooks();
    const { getSubRegionsForSuggestion } = useSubRegionHooks();

    const { placeId } = useParams();
    const navigate = useNavigate();

    const placeDetails = useSelector((state) => state.place.individualPlaces?.[placeId]);
    const allRegionsForSuggestions = useSelector((state) => state.user.allRegionsForSuggestions);
    const isProduction = useSelector((state) => state.user.isProduction);

    const [allSubRegions, setAllSubRegion] = useState([]);
    const [regionLoading, setRegionLoading] = useState(false);
    const [subRegionLoading, setSubRegionLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // formData holds the current field values
    // newImage holds the new File object if user picks a new image (null = no change)
    const [formData, setFormData] = useState({
        regionId: "",
        subRegionId: "",
        region: "",
        subRegion: "",
        placeName: "",
        category: "",
        notes: "",
        description: "",
        mapLink: "",
        existingImageUrl: null, // original image URL from backend
        preview: null,          // preview shown in UI (either existing URL or blob URL)
    });

    const [newImage, setNewImage] = useState(null); // File | null — only set when user uploads a new image

    const categories = ["Leisure", "Adventure", "Wildlife", "Cultural",  "Others"];

    // ─── Populate form when placeDetails loads ────────────────────────────────
    useEffect(() => {
        if (!placeDetails) return;
        setFormData((prev) => ({
            ...prev,
            regionId: placeDetails?.regionId?._id || "",
            region: placeDetails?.regionId?.name || "",
            subRegionId: placeDetails?.subRegionId?._id || "",
            subRegion: placeDetails?.subRegionId?.name || "",
            placeName: placeDetails?.placeName || "",
            category: placeDetails?.category || "",
            notes: placeDetails?.notes || "",
            description: placeDetails?.description || "",
            mapLink: placeDetails?.mapLink || "",
            existingImageUrl: placeDetails?.imageUrl || null,
            preview: placeDetails?.imageUrl || null,
        }));
    }, [placeDetails]);

    // ─── Fetch place by id ────────────────────────────────────────────────────
    const fetchPlaceById = async () => {
        try {
            setFetchLoading(true);
            await getPlaceById(placeId);
            setFetchLoading(false);
        } catch (error) {
            setFetchLoading(false);
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error fetching place details");
        }
    };

    useEffect(() => {
        fetchPlaceById();
    }, []);

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
            toast.error(error?.response?.data?.message || error?.message || "Error fetching regions");
        }
    };

    useEffect(() => {
        if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
        fetchRegionsForSuggestion();
    }, []);

    // ─── Fetch sub-regions when regionId changes ──────────────────────────────
    const fetchSubRegionsForSuggestion = async (regionId) => {
        try {
            setSubRegionLoading(true);
            const res = await getSubRegionsForSuggestion(regionId);
            setAllSubRegion(res?.data?.allSubRegions || []);
            setSubRegionLoading(false);
        } catch (error) {
            setSubRegionLoading(false);
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error fetching sub regions");
        }
    };

    useEffect(() => {
        if (!formData.regionId) return;
        // Always refetch sub-regions when regionId changes (cleared on region change)
        fetchSubRegionsForSuggestion(formData.regionId);
    }, [formData.regionId]);

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleRegionChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            region: value,
            regionId: allRegionsForSuggestions?.find((r) => r.name === value)?._id || "",
            subRegionId: "",
            subRegion: "",
        }));
        setAllSubRegion([]); // clear so useEffect refetches
        if (errors.region) setErrors((prev) => ({ ...prev, region: "" }));
    };

    const handleSubRegionChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            subRegionId: allSubRegions?.find((val) => val?.name === value)?._id || "",
            subRegion: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setNewImage(file); // track the new file separately
            setFormData((prev) => ({ ...prev, preview: previewUrl }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.region) newErrors.region = "Region is required";
        if (!formData.placeName) newErrors.placeName = "Place name is required";
        if (!formData.category) newErrors.category = "Category is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const payload = {
                _id:placeDetails?._id,
                regionId: formData.regionId,
                regionName: formData.region,
                subRegionId: formData.subRegionId,
                placeName: formData.placeName,
                category: formData.category,
                notes: formData.notes,
                description: formData.description,
                mapLink: formData.mapLink,
                // newImage is the File if user uploaded a new one, null if unchanged
                newImage: newImage,
                // existingImageUrl so backend knows what to delete if newImage is present
                existingImageUrl: formData.existingImageUrl,
            };

            setSubmitLoading(true)
            const response = await updatePlaceById(payload)
            setSubmitLoading(false)
            toast.success(response?.data?.message)
            navigate('/places')
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


    };

    // ─── Loading skeleton ─────────────────────────────────────────────────────
    if (fetchLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-400">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                    </svg>
                    <span className="text-sm font-medium">Loading place details...</span>
                </div>
            </div>
        );
    }

    // ─── UI ───────────────────────────────────────────────────────────────────
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-2xl font-bold" style={{ color: "#08255B" }}>
                    Update Place
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#08255B] cursor-pointer w-fit transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to List
                </button>
            </div>

            {/* Form Card */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8"
                style={{ boxShadow: "0 4px 24px rgba(8,37,91,0.10)" }}>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Row 1 — Region & Sub-Region */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Region */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Region Name <span style={{ color: "#ED5F8D" }}>*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="region"
                                    value={formData.region}
                                    onChange={handleRegionChange}
                                    className={`w-full appearance-none px-3 py-2.5 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.region ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"
                                        }`}
                                    style={{ focusRingColor: "#ED5F8D" }}
                                >
                                    <option value="">Select Region</option>
                                    {allRegionsForSuggestions?.map((r) => (
                                        <option key={r?._id} value={r?.name}>{r?.name}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region}</p>}
                        </div>

                        {/* Sub-Region */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Sub-Region <span style={{ color: "#ED5F8D" }}>*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="subRegion"
                                    value={formData.subRegion}
                                    onChange={handleSubRegionChange}
                                    disabled={!formData.regionId || subRegionLoading}
                                    className="w-full appearance-none px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {subRegionLoading ? "Loading..." : "Select Sub-Region"}
                                    </option>
                                    {allSubRegions?.map((sr) => (
                                        <option key={sr?._id} value={sr?.name}>{sr?.name}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 — Place Name & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Place Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Activity Name <span style={{ color: "#ED5F8D" }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="placeName"
                                placeholder="Enter Place Name"
                                value={formData.placeName}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.placeName ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"
                                    }`}
                            />
                            {errors.placeName && <p className="mt-1 text-xs text-red-500">{errors.placeName}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Category <span style={{ color: "#ED5F8D" }}>*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full appearance-none px-3 py-2.5 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.category ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
                        <input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Place Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Place Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Row 3 — Map Link & Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Map Link */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Google Map link (optional)
                            </label>
                            <input
                                type="text"
                                name="mapLink"
                                placeholder="https://maps.google.com"
                                value={formData.mapLink}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Images</label>
                            <div className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between gap-3 bg-gray-50">
                                {/* Left: upload button */}
                                <div className="flex flex-col items-center gap-1 flex-1">
                                    <label className="cursor-pointer flex flex-col items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400 mb-0.5"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span className="text-xs font-medium bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">
                                            Browse File
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {newImage ? (
                                            <span className="text-green-500 font-medium">New image selected</span>
                                        ) : (
                                            "Upload upto 1 images"
                                        )}
                                    </p>
                                </div>

                                {/* Right: preview thumbnail */}
                                <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                                    {formData.preview ? (
                                        <img
                                            src={formData.preview}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status label below upload box */}
                            {newImage && (
                                <p className="text-xs text-green-500 font-medium mt-1 text-right">
                                    Image updated ✓
                                </p>
                            )}
                            {!newImage && formData.existingImageUrl && (
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    Existing image • replace by uploading a new one
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            disabled={submitLoading}
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className={`flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ${submitLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                            style={{ backgroundColor: "#ED5F8D", boxShadow: "0 4px 14px rgba(237,95,141,0.30)" }}
                        >
                            {submitLoading ? (
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                                </svg>
                            ) : (
                                <Save size={16} />
                            )}
                            {submitLoading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePlace;