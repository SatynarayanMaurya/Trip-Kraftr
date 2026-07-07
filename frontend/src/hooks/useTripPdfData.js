// hooks/useTripPdfData.js

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { usePrivateTripHooks } from "./usePrivateTripHooks";
import { useSamplePackageHooks } from "./useSamplePackageHooks";
import { useRegionHooks } from "./useRegionHooks";
import { usePolicyHooks } from "./usePolicyHooks";
import { useGroupTripHooks } from "./useGroupTripHooks";


export const useTripPdfData = ({ tripId, tripType = 'privateTrip' }) => {

    const { getPrivateTripById } = usePrivateTripHooks();
    const { getSamplePackageById } = useSamplePackageHooks();
     const { getGroupTripById } = useGroupTripHooks();
    const { fetchOrgRegionImages } = useRegionHooks();
    const { getPoliciesForRegion } = usePolicyHooks();

    const isProduction = useSelector((state) => state.user.isProduction);

    const privateTripDetails = useSelector(
        (state) => state.privateTrip.privateTripById?.[tripId]
    );

    const samplePackageDetails = useSelector(
        (state) => state.samplePackage.samplePackageById?.[tripId]
    );

    const groupTripDetails = useSelector(s => s.groupTrip.groupTripById?.[tripId]);

    const isPrivateTrip = tripType === "privateTrip";
    const isSamplePackage = tripType === "samplePackage";
    const isGroupTrip = tripType === 'groupTrip'

    const tripDetailsMap = {
        privateTrip: privateTripDetails,
        samplePackage: samplePackageDetails,
        groupTrip: groupTripDetails, // <- add this
    };

    const tripDetails = tripDetailsMap[tripType] || null;

    const [regionsImage, setRegionsImage] = useState([]);
    const [policies, setPolicies] = useState(null);

    const [loading, setLoading] = useState(true);

    const handleError = (error, fallback = "Something went wrong") => {
        if (!isProduction) {
            console.log("========= PDF HOOK ERROR =========");
            console.log(error);
            console.log(error?.response);
            console.log("==================================");
        }

        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            fallback
        );
    };

    /**
     * Fetch Trip
     */
    const fetchTrip = useCallback(async () => {
        if (!tripId) return;

        try {
            const fetchMap = {
                privateTrip: getPrivateTripById,
                samplePackage: getSamplePackageById,
                groupTrip: getGroupTripById,
            };

            const fetchFn = fetchMap[tripType];

            if (!fetchFn) return;

            await fetchFn(tripId);
        } catch (error) {
            handleError(error);
        }
    }, [tripId, isPrivateTrip, isSamplePackage, isGroupTrip]);

    /**
     * Fetch Region Images
     */
    const fetchRegionImages = useCallback(async (regionId) => {
        if (!regionId) return;

        try {
            const response = await fetchOrgRegionImages(regionId);
            setRegionsImage(response?.data?.data || []);
        } catch (error) {
            handleError(error);
        }
    }, []);

    /**
     * Fetch Policies
     */
    const fetchPolicies = useCallback(async (regionId) => {
        if (!regionId) return;

        try {
            const response = await getPoliciesForRegion(regionId);
            setPolicies(response?.data?.data || null);
        } catch (error) {
            handleError(error, "Error fetching policies");
        }
    }, []);

    /**
     * Load Trip
     */
    useEffect(() => {
        fetchTrip();
    }, [fetchTrip]);

    /**
     * Load Dependent Data
     */
    useEffect(() => {
        if (!tripDetails?.regionDetails?.region1?._id) return;

        const load = async () => {
            setLoading(true);

            const regionId = tripDetails.regionDetails.region1._id;

            await Promise.all([
                fetchRegionImages(regionId),
                fetchPolicies(regionId),
            ]);

            setLoading(false);
        };

        load();
    }, [
        tripDetails?.regionDetails?.region1?._id,
        fetchPolicies,
        fetchRegionImages,
    ]);

    return {
        loading,

        tripDetails,

        regionsImage,

        policies,

        pdfData: {
            tripDetails,

            regionsImage,

            policies,
        },

        refetch: fetchTrip,
    };
};