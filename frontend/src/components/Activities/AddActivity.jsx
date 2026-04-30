import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRegionHooks } from "../../hooks/useRegionHooks";
import { useSubRegionHooks } from "../../hooks/useSubRegionHooks";
import { toast } from "react-toastify";
import { usePlaceHooks } from "../../hooks/usePlaceHooks";
import { Save, ArrowLeft } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useActivityHooks } from "../../hooks/useActivityHooks";
function AddPlace() {
  const { getRegionsForOrg } = useRegionHooks();

  const { getSubRegionsForSuggestion } = useSubRegionHooks();
  const [regionLoading, setRegionLoading] = useState(false);
  const [subRegionLoading, setSubRegionLoading] = useState(false);
  const [allSubRegions, setAllSubRegion] = useState([]);
  const isProduction = useSelector((state) => state.user.isProduction);
  const { addPlace } = usePlaceHooks();
  const {addActivity} = useActivityHooks()
  const [submitLoading, setSubmitLoading] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    regionId: "",
    subRegionId: "",
    region: "",
    subRegion: "",
    activityName: "",
    category: "Others",
    notes: "",
    description: "",
    price: 0,
    image: null,
    preview: null,
  });

  const [errors, setErrors] = useState({});

  const allRegionsForSuggestions = useSelector(
    (state) => state.user.allRegionsForSuggestions
  );

  const categories = ["Leisure", "Adventure", "Wildlife", "Cultural",  "Others"];

  const fetchRegionsForSuggestion = async () => {
    try {
      if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0)
        return;
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

  const fetchSubRegionsForSuggestion = async () => {
    try {
      if (allSubRegions && allSubRegions?.length > 0) return;
      setSubRegionLoading(true);
      const res = await getSubRegionsForSuggestion(formData.regionId);
      setAllSubRegion(res?.data?.allSubRegions);
      setSubRegionLoading(false);
    } catch (error) {
      setSubRegionLoading(false);
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching sub regions"
      );
    }
  };

  useEffect(() => {
    if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0)
      return;
    fetchRegionsForSuggestion();
  }, []);

  useEffect(() => {
    if (!formData.regionId) return;
    if (allSubRegions && allSubRegions?.length > 0) return;
    fetchSubRegionsForSuggestion(formData.regionId);
  }, [formData.regionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "region" && { regionId: "", subRegion: "" }),
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegionChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      region: value,
      regionId: allRegionsForSuggestions?.find((r) => r.name === value)?._id,
      subRegionId: "",
      subRegion: "",
    }));
    setAllSubRegion([]);
    if (errors.region) setErrors((prev) => ({ ...prev, region: "" }));
  };

  const handleSubRegionChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      subRegionId: allSubRegions?.find((val) => val?.name === value)?._id,
      subRegion: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: previewUrl,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.activityName) newErrors.placeName = "Activity name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const form = new FormData();

      form.append("regionId", formData.regionId);
      form.append("subRegionId", formData.subRegionId);
      form.append("activityName", formData.activityName);
      form.append("category", formData.category);
      form.append("description", formData.description);
      form.append("notes", formData.notes);
      form.append("price", formData.price);

      if (formData.image) {
        form.append("image", formData.image);
      }

      setSubmitLoading(true)
      const response = await addActivity(form)
      // console.log("Response : ",response)
      toast.success(response?.data?.message)
      setSubmitLoading(false)
      navigate(-1)

    } catch (error) {
      setSubmitLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error in adding the place"
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Activity</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500  hover:text-[#18305C] cursor-pointer w-fit"
        >
          <ArrowLeft size={16} />
          Back to List
        </button>
      </div>

      {/* Form Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Row 1 - Region & Sub-Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Region Name <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleRegionChange}
                  className={`w-full appearance-none px-3 py-2.5 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${errors.region
                      ? "border-red-400 ring-1 ring-red-300"
                      : "border-gray-300"
                    }`}
                >
                  <option value="">Select Region</option>
                  {allRegionsForSuggestions?.map((r) => (
                    <option key={r?._id} value={r?.name}>
                      {r?.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.region && (
                <p className="mt-1 text-xs text-red-500">{errors.region}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sub-Region <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="subRegion"
                  value={formData.subRegion}
                  onChange={handleSubRegionChange}
                  disabled={!formData.regionId}
                  className="w-full appearance-none px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">Select Sub-Region</option>
                  {formData.region &&
                    allSubRegions?.map((sr) => (
                      <option key={sr?._id} value={sr?.name}>
                        {sr?.name}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Activity Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Activity Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                name="activityName"
                placeholder="Enter Activity Name"
                value={formData.activityName}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${errors.placeName
                    ? "border-red-400 ring-1 ring-red-300"
                    : "border-gray-300"
                  }`}
              />
              {errors.activityName && (
                <p className="mt-1 text-xs text-red-500">{errors.activityName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full appearance-none px-3 py-2.5 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${errors.category
                      ? "border-red-400 ring-1 ring-red-300"
                      : "border-gray-300"
                    }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Notes
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Place Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Activity Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Row 3 - Price & Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Price
              </label>
              <input
                type="number"
                name="price"
                placeholder="$300"
                value={formData.price||''}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.price}</p>
            )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Images
              </label>
              <div className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-between gap-3 bg-gray-50">
                <div className="flex flex-col items-center gap-1 flex-1">
                  {/* Upload Icon + Button */}
                  <label className="cursor-pointer flex flex-col items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mb-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
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
                    Upload upto 1 images
                  </p>
                </div>

                {/* Preview thumbnail or placeholder */}
                <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                  {formData.preview ? (
                    <img
                      src={formData.preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                    </span>
                  )}
                </div>

                {/* Complete label */}
                {formData.preview && (
                  <span className="absolute text-xs text-green-500 font-medium">
                    Complete
                  </span>
                )}
              </div>
              {formData.preview && (
                <p className="text-xs text-green-500 font-medium mt-1 text-right">
                  Complete ✓
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={submitLoading}
              onClick={()=>navigate(-1)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitLoading}
              className={`flex items-center gap-2 px-6 py-2.5 bg-[#E91E8C] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
            ${submitLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-600'}`}
            >
              {submitLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                </svg>
              ) : (
                <Save size={16} />
              )}
              {submitLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPlace;