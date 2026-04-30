import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegionHooks } from "../useRegionHooks";
import { useSubRegionHooks } from "../useSubRegionHooks";
import { useVehicleHooks } from "../useVehicleHooks";
import { useHotelHooks } from "../useHotelHooks";
import { useRoomHooks } from "../useRoomHooks";
import { usePlaceHooks } from "../usePlaceHooks";
import { useActivityHooks } from "../useActivityHooks";
import { useGroupTripHooks } from "../useGroupTripHooks";

export const useRegionsData = () => {
  const { getRegionsForOrg } = useRegionHooks();

  const isProduction = useSelector((state) => state.user.isProduction);
  const allRegionsForSuggestions = useSelector(
    (state) => state.user.allRegionsForSuggestions
  );

  const [loading, setLoading] = useState(false);

  const fetchRegions = async () => {
    try {
      if (allRegionsForSuggestions?.length > 0) return;

      setLoading(true);
      await getRegionsForOrg();
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
          "Error fetching regions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return {
    regions: allRegionsForSuggestions,
    loading,
    refetch: fetchRegions,
  };
};


export const useSubRegionsData = ({ regionIds, enabled, skip = false,
}) => {
  const { getSubRegionsByRegionIds } = useSubRegionHooks();

  const isProduction = useSelector((state) => state.user.isProduction);
  const allSubRegions = useSelector((state)=>state.subRegion.subRegionByRegionKey?.[regionIds?.join(",")])

  const [loading, setLoading] = useState(false);

  const fetchSubRegions = async () => {
    try {
      if (!regionIds || regionIds?.length === 0) return;

      const validRegionIds = regionIds.filter(Boolean).slice(0, 3);
      if (validRegionIds.length === 0) return;

      if (allSubRegions?.length > 0) return;

      setLoading(true);

      await getSubRegionsByRegionIds(validRegionIds);

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
          "Error fetching sub regions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!skip) {
      fetchSubRegions();
    }
  }, [enabled,JSON.stringify(regionIds), skip]);

  return {
    loading,
    refetch: fetchSubRegions, // optional but useful
  };
};

export const useVehiclesData = ({ regionIds,enabled, skip = false,
}) => {
  const { getVehiclesByRegionIds } = useVehicleHooks();

  const isProduction = useSelector((state) => state.user.isProduction);
  const allVehicles = useSelector((state)=>state.vehicle.vehiclesByRegionKey?.[regionIds?.join(",")])
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!regionIds || regionIds?.length === 0) return;

      const validRegionIds = regionIds.filter(Boolean).slice(0, 3);
      if (validRegionIds.length === 0) return;

      // optional: skip if already in redux
      if (allVehicles?.length > 0) return;

      setLoading(true);

      await getVehiclesByRegionIds(validRegionIds);

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
          "Error fetching Vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!skip) {
      fetchData();
    }
  }, [enabled, JSON.stringify(regionIds), skip]);

  return {
    loading,
    refetch: fetchData, // optional but useful
  };
};

export const useHotelsData = ({ subRegionIds,enabled, skip = false,
}) => {
  const {getHotelsBySubRegionIds} = useHotelHooks()

  const isProduction = useSelector((state) => state.user.isProduction);
  const allHotels = useSelector((state)=>state.hotel.hotelsBysubRegionKey?.[subRegionIds?.join(",")])
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!subRegionIds || subRegionIds?.length === 0) return;

      const validSubRegionIds = subRegionIds.filter(Boolean).slice(0, 3);
      if (validSubRegionIds.length === 0) return;

      if (allHotels?.length > 0) return;

      setLoading(true);

      await getHotelsBySubRegionIds(validSubRegionIds);

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
          "Error fetching Vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!skip) {
      fetchData();
    }
  }, [enabled, JSON.stringify(subRegionIds), skip]);

  return {
    loading,
    refetch: fetchData, // optional but useful
  };
};


export const useRoomTypesData = ({ hotelId,enabled, skip = false,
}) => {
  const {getRoomsTypeForHotelId} = useRoomHooks()

  const isProduction = useSelector((state) => state.user.isProduction);
  const allRoomTypes = useSelector((state)=>state.hotel.roomTypesForHotelId?.[hotelId])
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!hotelId ) return;

      if (allRoomTypes?.length > 0) return;

      setLoading(true);

      await getRoomsTypeForHotelId(hotelId);

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
          "Error fetching Room Type"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!skip) {
      fetchData();
    }
  }, [enabled,  JSON.stringify(hotelId), skip]);

  return {
    loading,
    refetch: fetchData, // optional but useful
  };
};

export const useSuggestionGroupTripsData = ({region1,region2,region3, noOfDays,enabled, skip = false,
}) => {

  const {suggestionGroupTrips} = useGroupTripHooks()

  const isProduction = useSelector((state) => state.user.isProduction);
  const alreadySuggestionGroupTrip = useSelector(s=>s.groupTrip.suggestionGroupTripsSlice?.[`${region1},${region2},${region3},${noOfDays}`])
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!region1 || !noOfDays ) return;
      if(alreadySuggestionGroupTrip) return ;
      setLoading(true);

      await suggestionGroupTrips(region1,region2,region3, noOfDays);

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
          "Error fetching Suggestion group trip"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!skip) {
      fetchData();
    }
  }, [enabled, region1,region2,region3, noOfDays, skip]);

  return {
    loading,
    refetch: fetchData, // optional but useful
  };
};




export const usePlacesData = ({ subRegionIds,enabled, skip = false,
}) => {
  const { getPlacesBySubRegionIds} = usePlaceHooks()

  const isProduction = useSelector((state) => state.user.isProduction);
  const allPlaces = useSelector((state)=>state.hotel.placesBySubRegionKey?.[subRegionIds?.join(",")])
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!subRegionIds || subRegionIds?.length === 0) return;

      const validSubRegionIds = subRegionIds.filter(Boolean).slice(0, 3);
      if (validSubRegionIds.length === 0) return;

      if (allPlaces?.length > 0) return;

      setLoading(true);

      await getPlacesBySubRegionIds(validSubRegionIds);

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
          "Error fetching Vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!skip) {
      fetchData();
    }
  }, [enabled, JSON.stringify(subRegionIds), skip]);

  return {
    loading,
    refetch: fetchData, // optional but useful
  };
};

export const useActivitiesData = ({ subRegionIds,enabled, skip = false,
}) => {
  const {getActivitiesBySubRegionIds} = useActivityHooks()

  const isProduction = useSelector((state) => state.user.isProduction);
  const allActivity = useSelector((state)=>state.hotel.activitiesBySubRegionKey?.[subRegionIds?.join(",")])
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!subRegionIds || subRegionIds?.length === 0) return;

      const validSubRegionIds = subRegionIds.filter(Boolean).slice(0, 3);
      if (validSubRegionIds.length === 0) return;

      if (allActivity?.length > 0) return;

      setLoading(true);

      await getActivitiesBySubRegionIds(validSubRegionIds);

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
          "Error fetching Activities"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!skip) {
      fetchData();
    }
  }, [enabled, JSON.stringify(subRegionIds), skip]);

  return {
    loading,
    refetch: fetchData, // optional but useful
  };
};