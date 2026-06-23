import { useRef } from "react"
import { useDispatch } from "react-redux"
import { apiConnector } from "../services/apiConnector"
import { regionEndpoints } from "../services/Apis/regionApis"
import { setLoading } from "../redux/slices/userSlice"
import { subRegionEndpoints } from "../services/Apis/subRegionApis"
import { vehicleEndpoinsts } from "../services/Apis/vehicleApis"
import { hotelEndpoinsts } from "../services/Apis/hotelApis"
import { placeEndpoints } from "../services/Apis/placeApis"
import { activityEndpoints } from "../services/Apis/activityApis"
import { groupTripEndpoints } from "../services/Apis/groupTripApis"
import { accountsEndpoints } from "../services/Apis/accountsApis"
import { enquiriessEndpoints } from "../services/Apis/enquiriesApis"
import { roomRateEndpoints } from "../services/Apis/roomRateApis"
import { samplePackageEndpoints } from "../services/Apis/samplePackageApis"

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
        "searchPlaceForOrgOrGlobal",
        (searchTerm,regionId,regionName,pageLimit=10,isGlobal) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (regionId) params.append("regionId", regionId);
          if (pageLimit) params.append("pageLimit", pageLimit);
          if (regionName) params.append("regionName", regionName);
          params.append("isGlobal", isGlobal);
      
          return apiConnector(
            "GET",
            `${placeEndpoints.SEAECH_PLACE}?${params.toString()}`
          );
        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchActivities = debounceSearch(
        "searchActivities",
        (searchTerm,regionId,pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (regionId) params.append("regionId", regionId);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${activityEndpoints.SEARCH_ACTIVITY}?${params.toString()}`
          );
        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchGroupTrips = debounceSearch(
        "searchGroupTrips",
        (searchTerm,regionId,pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (regionId) params.append("regionId", regionId);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${groupTripEndpoints.SEARCH_GROUP_TRIPS}?${params.toString()}`
          );
        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchB2BAccounts = debounceSearch(
        "searchB2BAccounts",
        (searchTerm,filter,region,pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (filter) params.append("filter", filter);
          if (region) params.append("region", region);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${accountsEndpoints.SEARCH_B2B_ACCOUNTS}?${params.toString()}`
          );
        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchB2BEnquiry = debounceSearch(
        "searchB2BEnquiry",
        (searchTerm,filter,region, month,forParticipant =false) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (filter) params.append("filter", filter);
          if (region) params.append("region", region);
          if (month) params.append("month", month);
          params.append("forParticipant", forParticipant);
      
          return apiConnector(
            "GET",
            `${enquiriessEndpoints.SEARCH_B2B_ENQUIRY}?${params.toString()}`
          );
        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchB2CEnquiry = debounceSearch(
        "searchB2CEnquiry",
        (searchTerm,filter,region, month, forParticipant=false) => {
          const params = new URLSearchParams();
          if (searchTerm) params.append("search", searchTerm);
          if (filter) params.append("filter", filter);
          if (region) params.append("region", region);
          if (month) params.append("month", month);
          params.append("forParticipant", forParticipant);
      
          return apiConnector(
            "GET",
            `${enquiriessEndpoints.SEARCH_B2C_ENQUIRY}?${params.toString()}`
          );
        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchB2CAccounts = debounceSearch(
        "searchB2CAccounts",
        (searchTerm,filter,region,pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (filter) params.append("filter", filter);
          if (region) params.append("region", region);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${accountsEndpoints.SEARCH_B2C_ACCOUNTS}?${params.toString()}`
          );
        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchB2BAccountsForEnquiry = debounceSearch(
        "searchB2BAccountsForEnquiry",
        (searchTerm, pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${enquiriessEndpoints.GET_SEARCHED_B2B_ACCOUNT_FOR_ENQUIRY}?${params.toString()}`
          );

        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchB2CAccountsForEnquiry = debounceSearch(
        "searchB2CAccountsForEnquiry",
        (searchTerm, pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${enquiriessEndpoints.GET_SEARCHED_B2C_ACCOUNT_FOR_ENQUIRY}?${params.toString()}`
          );

        },
        300
      );

          // ---------- Subregion Search for org ( ) ----------
    const searchSamplePackage = debounceSearch(
        "searchSamplePackage",
        (searchTerm,regionId,days, pageLimit=10) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("search", searchTerm);
          if (regionId) params.append("regionId", regionId);
          if (days) params.append("days", days);
          if (pageLimit) params.append("pageLimit", pageLimit);
      
          return apiConnector(
            "GET",
            `${samplePackageEndpoints.SEARCH_SAMPLE_PACKAGE}?${params.toString()}`
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
        searchPlaces,
        searchActivities,
        searchGroupTrips,
        searchB2BAccounts,
        searchB2BEnquiry,
        searchB2CEnquiry,
        searchB2CAccounts,
        searchB2BAccountsForEnquiry,
        searchB2CAccountsForEnquiry,
        searchSamplePackage

    }
}