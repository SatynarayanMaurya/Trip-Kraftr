import { useRef } from "react"
import { useDispatch } from "react-redux"
import { apiConnector } from "../services/apiConnector"
import { regionEndpoints } from "../services/Apis/regionApis"
import { setLoading } from "../redux/slices/userSlice"
import { subRegionEndpoints } from "../services/Apis/subRegionApis"
import { vehicleEndpoinsts } from "../services/Apis/vehicleApis"
import { hotelEndpoinsts } from "../services/Apis/hotelApis"
import { placeEndpoints } from "../services/Apis/placeApis"

export const useCommonHooks = () => {
    const dispatch = useDispatch()

    // store debounce timers
    const debounceTimers = useRef({})

    const debounceSearch = (key, apiCall, delay = 500) => {
        return (...args) => {
            return new Promise((resolve, reject) => {
                if (debounceTimers.current[key]) {
                    clearTimeout(debounceTimers.current[key])
                }

                debounceTimers.current[key] = setTimeout(async () => {
                    try {
                        dispatch(setLoading(true))
                        const response = await apiCall(...args)
                        resolve(response)
                    } catch (error) {
                        reject(error)
                    } finally {
                        dispatch(setLoading(false))
                    }
                }, delay)
            })
        }
    }

    // ---------- Master Region Search ----------
    const searchMasterRegion = debounceSearch(
        "searchMasterRegion",
        (searchTerm, filter) =>
            apiConnector(
                "GET",
                `${regionEndpoints.SEARCH_MASTER_REGIONS}?search=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(filter)}`
            ),
        300 
    )

    // ---------- Master Country Search ----------
    const searchMasterCountry = debounceSearch(
        "searchMasterCountry",
        (searchTerm) =>
            apiConnector(
                "GET",
                `${regionEndpoints.SEARCH_MASTER_COUNTRIES}?search=${encodeURIComponent(searchTerm)}`
            ),
        300 
    )

    // ---------- Master Country Search ----------
    const searchMasterRegionOnly = debounceSearch(
        "searchMasterRegionOnly",
        (searchTerm) =>
            apiConnector(
                "GET",
                `${regionEndpoints.SEARCH_MASTER_REGION_ONLY}?countryName=${encodeURIComponent(searchTerm)}`
            ),
        300 
    )
    // ---------- Region Search for org ( Actually for adding sub region we need region for suggestion ) ----------
    const searchRegionForOrg = debounceSearch(
        "searchRegionForOrg",
        (searchTerm) =>
            apiConnector(
                "GET",
                `${subRegionEndpoints.SEARCH_REGIONS_FOR_ORG}?regionName=${encodeURIComponent(searchTerm)}`
            ),
        300 
    )
    // ---------- Subregion Search for org ( ) ----------
    const searchSubRegionForOrg = debounceSearch(
        "searchSubRegionForOrg",
        (searchTerm,filter,regionId,pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (filter) params.append("filter", filter);
          if (regionId) params.append("regionId", regionId);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${subRegionEndpoints.SEARCH_SUB_REGIONS}?${params.toString()}`
          );
        },
        300
      );

    // ---------- Search Vehicle with filter like search sort type and regionId ----------
    const searchVehicles = debounceSearch(
        "searchVehicles",
        (search, sort, type, regionId,pageLimit) => {
          const params = new URLSearchParams();
      
          if (search) params.append("search", search);
          if (sort) params.append("sort", sort);
          if (type) params.append("type", type);
          if (regionId) params.append("regionId", regionId);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${vehicleEndpoinsts.SEARCH_VEHICLE}?${params.toString()}`
          );
        },
        300
      );

    // ---------- Search Hotel with filter like search sort type and regionId ----------
    const searchHotels = debounceSearch(
        "searchHotels",
        (search, regionId,category,subRegionId,pageLimit) => {
          const params = new URLSearchParams();
      
          if (search) params.append("search", search);
          if (category) params.append("category", category);
          if (regionId) params.append("regionId", regionId);
          if (subRegionId) params.append("subRegionId", subRegionId);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${hotelEndpoinsts.SEARCH_HOTEL}?${params.toString()}`
          );
        },
        300
      );


          // ---------- Subregion Search for org ( ) ----------
    const searchPlaces = debounceSearch(
        "searchSubRegionForOrg",
        (searchTerm,regionId,pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (regionId) params.append("regionId", regionId);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${placeEndpoints.SEAECH_PLACE}?${params.toString()}`
          );
        },
        300
      );



    return {
        searchMasterRegion,
        searchMasterCountry,
        searchMasterRegionOnly,
        searchRegionForOrg,
        searchSubRegionForOrg,
        searchVehicles,
        searchHotels,
        searchPlaces

    }
}