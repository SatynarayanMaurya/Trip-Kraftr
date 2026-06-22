import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlaceHooks } from '../../hooks/usePlaceHooks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ArrowLeft, Pencil, MapPin, Tag, FileText, AlignLeft, Link, Image } from 'lucide-react';
import { useActivityHooks } from '../../hooks/useActivityHooks';

const BLUE = "#08255B";
const PINK = "#ED5F8D";

function Field({ label, value, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      {children ?? (
        <span className="text-sm font-medium text-gray-700 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg min-h-[40px] flex items-center">
          {value || <span className="text-gray-300 italic">—</span>}
        </span>
      )}
    </div>
  );
}

function ViewActivity() {
  const { getActivityById } = useActivityHooks();
  const { activityId } = useParams();
  const { placeId } = useParams();
  const navigate = useNavigate();

  const activityDetails = useSelector((state) => state.activity.individualActivity?.[activityId]);
  const isProduction = useSelector((state) => state.user.isProduction);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchActivityById = async () => {
    try {
      setFetchLoading(true);
      await getActivityById(activityId);
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
    fetchActivityById();
  }, []);

  // ─── Loading ──────────────────────────────────────────────────────────────
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
  // ─── Not found ────────────────────────────────────────────────────────────
  if (!activityDetails) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">Activity not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-medium hover:underline"
            style={{ color: BLUE }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = activityDetails?.imageUrl;



  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: BLUE }}>
            View Activity
          </h1>
          {/* Edit button */}
          <button
            onClick={() => navigate(`/activities/update-activity/${activityId}`)}
            className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-all hover:opacity-90"
            style={{
              backgroundColor: PINK,
              boxShadow: "0 4px 14px rgba(237,95,141,0.30)"
            }}
          >
            <Pencil size={15} />
            Edit Activity
          </button>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#08255B] cursor-pointer w-fit transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Activities
        </button>
      </div>

      {/* Detail Card */}
      <div
        className="max-w-4xl mx-auto bg-white rounded-2xl p-8"
        style={{ boxShadow: "0 4px 24px rgba(8,37,91,0.10)" }}
      >
        <div className="space-y-6">

          {/* Row 1 — Region & Sub-Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Region Name" value={activityDetails?.regionId?.name} />
            <Field label="Sub-Region" value={activityDetails?.subRegionId?.name} />
          </div>

          {/* Row 2 — Place Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Activity Name" value={activityDetails?.activityName} />
            <Field label="Category">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg min-h-[40px]">
                {activityDetails?.category ? (
                  <>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "#fff0f5", color: PINK }}
                    >
                      {activityDetails.category}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-300 italic text-sm">—</span>
                )}
              </div>
            </Field>
          </div>

          {/* Notes */}
          <Field label="Notes" value={activityDetails?.notes} />

          {/* Description */}
          <Field label="Place Description">
            <div className="px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg min-h-[80px] text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {activityDetails?.description || <span className="text-gray-300 italic">—</span>}
            </div>
          </Field>

          {/* Row 3 — Map Link & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Google Map Link */}
            <Field label="Price">
              <div className="px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg min-h-[40px] flex items-center">
                  <span className=" italic text-sm">{activityDetails?.price}</span>
              </div>
            </Field>

            {/* Image */}
            <Field label="Image">
              <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center gap-4">
                {imageUrl && !imgError ? (
                  <>
                    {/* Larger preview */}
                    <div className="w-40 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-sm">
                      <img
                        src={imageUrl}
                        alt={activityDetails?.activityName || "Activity image"}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-gray-500">Activity image</span>
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold flex items-center gap-1 hover:underline"
                        style={{ color: PINK }}
                      >
                        <Link size={11} />
                        View full image
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <Image size={22} className="text-gray-300" />
                    </div>
                    <span className="text-sm italic text-gray-300">No image uploaded</span>
                  </div>
                )}
              </div>
            </Field>
          </div>


        </div>
      </div>
    </div>
  );
}

export default ViewActivity