import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRegionHooks } from "../../hooks/useRegionHooks";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModals/DeleteModal";

function InfoRow({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold text-gray-700 break-all ${mono ? "font-mono text-xs text-gray-500" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function SectionHeader({ title, badge }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
      <div className="w-1 h-5 bg-pink-500 rounded-full" />
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h2>
      {badge && (
        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{badge}</span>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export default function ViewRegion() {
  const { getRegionById,deleteRegionById } = useRegionHooks();
  const isProduction = useSelector((state) => state.user.isProduction);
  const { regionId } = useParams();
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const navigate = useNavigate();

  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  const logError = (error) => {
    if (!isProduction) {
      console.log("========= ERROR DEBUG START =========");
      console.log("Error:", error);
      console.log("Response:", error?.response);
      console.log("========= ERROR DEBUG END =========");
    }
  };

  useEffect(() => {
    fetchRegion();
  }, [regionId]);

  const fetchRegion = async () => {
    setLoading(true);
    try {
      const res = await getRegionById(regionId);
      setRegion(res?.data?.findRegion);
    } catch (error) {
      logError(error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to load region");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading region details...</span>
        </div>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-3">Region not found.</p>
          <button onClick={() => navigate(-1)} className="text-pink-500 text-sm font-semibold hover:underline cursor-pointer">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const deleteRegion = async()=>{
    try{
      const res = await deleteRegionById(regionId)
      toast.success(res?.data?.message)
      navigate(-1)
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
  }

  const meta = region?.masterRegionId;
  const marginRangeValid = region?.min_margin != null && region?.max_margin != null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">


      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">View Region</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Details for <span className="text-pink-500 font-semibold">{meta?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full
                            ${region?.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
              {region?.is_active ? "● Active" : "● Inactive"}
            </span>
            <button
              onClick={() => navigate(`/regions/edit-region/${regionId}`)}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-pink-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Region
            </button>
            <button
              onClick={() => setOpenDeleteModal(true)}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-red-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M6 7l1-3h10l1 3M6 7h12l-1 13a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z" />
              </svg>
              Delete Region
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5">

        {/* Master Region Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader title="Region Info" />
          <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-5">
            <InfoRow label="Region Name" value={meta?.name} />
            <InfoRow label="Country" value={meta?.country} />
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Master Region Status</p>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                                ${meta?.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {meta?.is_active ? "● Active" : "● Inactive"}
              </span>
            </div>
            <InfoRow label="Master Region ID" value={meta?._id} mono />
          </div>
        </div>

        {/* Region Details */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader title="Region Details" />
          <div className="px-6 py-5 space-y-5">

            {/* Description */}
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                {region?.description || "No description provided."}
              </p>
            </div>

            {/* Margins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Min Margin</p>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <span className="text-2xl font-bold text-gray-700">{region?.min_margin ?? "—"}</span>
                  <span className="text-sm text-gray-400 font-medium">%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Max Margin</p>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <span className="text-2xl font-bold text-gray-700">{region?.max_margin ?? "—"}</span>
                  <span className="text-sm text-gray-400 font-medium">%</span>
                </div>
              </div>
            </div>

            {/* Margin Range Visual Bar */}
            {marginRangeValid && (
              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Margin Range</p>
                <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-linear-to-r from-pink-400 to-pink-500 rounded-full"
                    style={{
                      left: `${region?.min_margin}%`,
                      width: `${region?.max_margin - region?.min_margin}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">{region?.min_margin}%</span>
                  <span className="text-xs text-pink-500 font-semibold">
                    {region?.max_margin - region?.min_margin}% spread
                  </span>
                  <span className="text-xs text-gray-400">{region?.max_margin}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader title="Region Images" badge={region?.region_images?.length} />
          <div className="px-6 py-5">
            {!region?.region_images?.length ? (
              <div className="text-center py-10 text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No images available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                {region?.region_images.map((url, index) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-xl overflow-hidden group border-2 border-transparent hover:border-pink-300 transition-all"
                    title="Open full image"
                  >
                    <img src={url} alt={`Region image ${index + 1}`} className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5">
                      <p className="text-white text-xs font-medium">Image {index + 1}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audit / Meta Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader title="Audit Info" />
          <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-5">
            <InfoRow label="Created At" value={formatDate(region?.createdAt)} />
            <InfoRow label="Updated At" value={formatDate(region?.updatedAt)} />
            <InfoRow label="Updated By" value={region?.updatedBy?.name} mono />
            <InfoRow label="Organisation ID" value={region?.org_id} mono />
          </div>
          <div className="px-6 pb-5 grid grid-cols-2 md:grid-cols-4 gap-5">
            <InfoRow label="Region ID" value={region?._id} mono />
          </div>
        </div>

      </div>


      {/* Delete Modal  */}
      {
        openDeleteModal && 
        <DeleteModal onDelete={deleteRegion}  onClose={()=>setOpenDeleteModal(false)} itemName ={region?.masterRegionId?.name} confirmText ={region?.masterRegionId?.name}/>
      }
    </div>
  );
}