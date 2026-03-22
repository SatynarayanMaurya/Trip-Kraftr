import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRegionHooks } from "../../hooks/useRegionHooks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateRegion } from "../../redux/slices/regionSlice";

export default function EditRegion() {
    const { getRegionById, fetchRegionImages, updateRegionById } = useRegionHooks();
    const isProduction = useSelector((state) => state.user.isProduction);
    const { regionId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // Kept to enable discard — reset form back to last saved state
    const [originalRegion, setOriginalRegion] = useState(null);

    // Single object for all editable fields
    const [form, setForm] = useState({
        description: "",
        min_margin: "",
        max_margin: "",
        is_active: true,
        region_images: [], // array of URL strings
    });

    // Read-only meta from masterRegionId
    const [regionMeta, setRegionMeta] = useState(null);

    // More images panel state
    const [showMorePanel, setShowMorePanel] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [moreImages, setMoreImages] = useState([]);     // URL strings from API, filtered to exclude current images
    const [stagingImages, setStagingImages] = useState([]); // URL strings being staged before confirm

    const [errors, setErrors] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const logError = (error) => {
        if (!isProduction) {
            console.log("========= ERROR DEBUG START =========");
            console.log("Error:", error);
            console.log("Response:", error?.response);
            console.log("========= ERROR DEBUG END =========");
        }
    };

    // ─── Fetch region on mount ────────────────────────────────────────────────
    useEffect(() => {
        fetchRegion();
    }, [regionId]);

    const fetchRegion = async () => {
        try {
            const res = await getRegionById(regionId);
            const data = res?.data?.findRegion;
            setOriginalRegion(data);
            setRegionMeta(data?.masterRegionId);
            setForm({
                description: data?.description || "",
                min_margin: data?.min_margin ?? "",
                max_margin: data?.max_margin ?? "",
                is_active: data?.is_active ?? true,
                region_images: data?.region_images || [],
            });
        } catch (error) {
            logError(error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to load region");
        }
    };

    // ─── Load more images from master region ─────────────────────────────────
    const handleLoadMore = async () => {
        setShowMorePanel(true);
        setLoadingMore(true);
        setStagingImages([]);
        try {
            const res = await fetchRegionImages(regionMeta?._id);
            const images = [
                ...(res?.data?.regionsImages?.images?.map((img) => img?.url) || []),
                ...(res?.data?.regionsImages?.imageLinks || [])
              ];
            const filtered = images.filter((url) => !form.region_images.includes(url));
            setMoreImages(filtered);
        } catch (error) {
            logError(error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to fetch images");
        } finally {
            setLoadingMore(false);
        }
    };

    // ─── Image helpers ────────────────────────────────────────────────────────
    const handleRemoveImage = (url) => {
        setForm((prev) => ({
            ...prev,
            region_images: prev.region_images.filter((img) => img !== url),
        }));
        // Put it back in the "more" pool so the user can re-add it if needed
        setMoreImages((prev) => (prev.includes(url) ? prev : [url, ...prev]));
    };

    const toggleStaging = (url) => {
        setStagingImages((prev) =>
            prev.includes(url) ? prev.filter((i) => i !== url) : [...prev, url]
        );
    };

    const handleAddStaged = () => {
        if (stagingImages.length === 0) return;
        setForm((prev) => ({
            ...prev,
            region_images: [...prev.region_images, ...stagingImages],
        }));
        // Remove confirmed images from the pool to keep it clean
        setMoreImages((prev) => prev.filter((url) => !stagingImages.includes(url)));
        setStagingImages([]);
        setShowMorePanel(false);
    };

    // ─── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.description.trim()) e.description = "Description is required.";
        if (form.min_margin === "" || form.min_margin === null) e.min_margin = "Min margin is required.";
        if (form.max_margin === "" || form.max_margin === null) e.max_margin = "Max margin is required.";
        if (form.min_margin !== "" && form.max_margin !== "") {
            if (parseFloat(form.max_margin) <= parseFloat(form.min_margin))
                e.max_margin = "Max margin must be greater than min margin.";
        }
        return e;
    };

    // ─── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        try {
            setSaving(true)
            const res= await updateRegionById(regionId, {
                description: form.description,
                min_margin: parseFloat(form.min_margin),
                max_margin: parseFloat(form.max_margin),
                is_active: form.is_active,
                region_images: form.region_images,
            });
            setOriginalRegion((prev) => ({ ...prev, ...form }));
            dispatch(updateRegion(res?.data?.updatedRegion))
            
            toast.success(res?.data?.message)
            setSaving(false)
            navigate(-1)
        } catch (error) {
            logError(error);
            setSaving(false)
            toast.error(error?.response?.data?.message || error?.message || "Failed to save changes");
        }
    };

    // ─── Discard — reset to last saved state ─────────────────────────────────
    const handleDiscard = () => {
        if (!originalRegion) return;
        setForm({
            description: originalRegion.description || "",
            min_margin: originalRegion.min_margin ?? "",
            max_margin: originalRegion.max_margin ?? "",
            is_active: originalRegion.is_active ?? true,
            region_images: originalRegion.region_images || [],
        });
        setErrors({});
        setShowMorePanel(false);
        setStagingImages([]);
    };

    // ─── UI ───────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <button onClick={()=>navigate(-1)}  className="flex cursor-pointer items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to List
                    </button>
                </div>
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Edit Region</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Update details for <span className="text-pink-500 font-semibold">{regionMeta?.name}</span></p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-semibold ${form.is_active ? "text-green-600" : "text-gray-400"}`}>
                            {form.is_active ? "Active" : "Inactive"}
                        </span>
                        <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none
                                ${form?.is_active ? "bg-pink-500" : "bg-gray-300"}`}
                            title={form?.is_active ? "Click to deactivate" : "Click to activate"}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300
                                ${form?.is_active ? "translate-x-5" : "translate-x-0"}`}
                            />
                        </button>
                    </div>
                </div>
            </div>


            <div className="space-y-5">

                {/* Read-only Info Banner */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <div className="w-1 h-5 bg-pink-500 rounded-full" />
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Region Info</h2>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Read only</span>
                    </div>
                    <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Region Name</p>
                            <p className="text-sm font-semibold text-gray-700">{regionMeta?.name || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Country</p>
                            <p className="text-sm font-semibold text-gray-700">{regionMeta?.country || "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Editable Fields */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <div className="w-1 h-5 bg-pink-500 rounded-full" />
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Region Details</h2>
                    </div>
                    <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Description <span className="text-pink-500">*</span>
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                placeholder="Enter region description..."
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none transition-all
                                    ${errors.description ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white"}`}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Min Margin (%) <span className="text-pink-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.min_margin}
                                    onChange={(e) => setForm((prev) => ({ ...prev, min_margin: e.target.value }))}
                                    className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all
                                        ${errors.min_margin ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white"}`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">%</span>
                            </div>
                            {errors.min_margin && <p className="text-red-500 text-xs mt-1">{errors.min_margin}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Max Margin (%) <span className="text-pink-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.max_margin}
                                    onChange={(e) => setForm((prev) => ({ ...prev, max_margin: e.target.value }))}
                                    className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all
                                        ${errors.max_margin ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white"}`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">%</span>
                            </div>
                            {errors.max_margin && <p className="text-red-500 text-xs mt-1">{errors.max_margin}</p>}
                            {form.min_margin !== "" && form.max_margin !== "" && parseFloat(form.max_margin) > parseFloat(form.min_margin) && (
                                <p className="text-xs text-green-600 mt-1 font-medium">
                                    ✓ Range: {form.min_margin}% – {form.max_margin}%
                                </p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Images Section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <div className="w-1 h-5 bg-pink-500 rounded-full" />
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Region Images</h2>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{form.region_images.length}</span>
                        <button
                            onClick={handleLoadMore}
                            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-pink-500 border border-pink-200 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add More Images
                        </button>
                    </div>

                    <div className="px-6 py-5">
                        {form.region_images.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <svg className="w-10 h-10 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">No images added yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                                {form.region_images.map((url) => (
                                    <div
                                        key={url}
                                        className="relative rounded-xl overflow-hidden group border-2 border-transparent transition-all duration-300"
                                    >
                                        <img src={url} alt="" className="w-full h-28 object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                                        <button
                                            onClick={() => handleRemoveImage(url)}
                                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow"
                                            title="Remove image"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform">
                                            <p className="text-white text-xs font-medium truncate">{url.split("/").pop()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* More Images Panel */}
                {showMorePanel && (
                    <div className="bg-white rounded-2xl border border-pink-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-pink-100 bg-pink-50 flex items-center gap-2">
                            <div className="w-1 h-5 bg-pink-500 rounded-full" />
                            <h2 className="text-sm font-bold text-pink-700 uppercase tracking-wide">Available Images</h2>
                            <p className="text-xs text-pink-400 ml-1">Select images to add</p>
                            {stagingImages.length > 0 && (
                                <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                    {stagingImages.length} selected
                                </span>
                            )}
                            <button
                                onClick={() => { setShowMorePanel(false); setStagingImages([]); }}
                                className="ml-auto text-pink-400 hover:text-pink-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            {loadingMore ? (
                                <div className="flex items-center justify-center py-10 gap-3">
                                    <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm text-gray-400">Fetching images for {regionMeta?.name}...</span>
                                </div>
                            ) : moreImages.length === 0 ? (
                                <p className="text-center py-8 text-sm text-gray-400">No additional images available.</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-4">
                                        {moreImages.map((url) => {
                                            const isStaged = stagingImages.includes(url);
                                            return (
                                                <button
                                                    key={url}
                                                    type="button"
                                                    onClick={() => toggleStaging(url)}
                                                    className={`relative rounded-xl overflow-hidden border-2 transition-all group
                                                        ${isStaged ? "border-pink-500 shadow-md shadow-pink-100 scale-[1.02]" : "border-transparent hover:border-pink-300"}`}
                                                >
                                                    <img src={url} alt="" className="w-full h-28 object-cover" />
                                                    <div className={`absolute inset-0 transition-all ${isStaged ? "bg-pink-500/20" : "bg-transparent group-hover:bg-pink-500/10"}`} />
                                                    {isStaged && (
                                                        <div className="absolute top-1.5 right-1.5 bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center shadow">
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5">
                                                        <p className="text-white text-xs font-medium truncate">{url.split("/").pop()}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddStaged}
                                            disabled={stagingImages.length === 0}
                                            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all
                                                ${stagingImages.length === 0
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-pink-500 hover:bg-pink-600 text-white shadow-sm shadow-pink-200"}`}
                                        >
                                            Add {stagingImages.length > 0 ? `${stagingImages.length} ` : ""}Selected
                                        </button>
                                        <button
                                            onClick={() => { setShowMorePanel(false); setStagingImages([]); }}
                                            className="px-5 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Save / Discard */}
                <div className="flex items-center gap-3 pb-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-7 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-pink-200 flex items-center gap-2"
                    >
                        {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        onClick={handleDiscard}
                        disabled={saving}
                        className="px-7 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-60"
                    >
                        Discard
                    </button>
                </div>

            </div>
        </div>
    );
}