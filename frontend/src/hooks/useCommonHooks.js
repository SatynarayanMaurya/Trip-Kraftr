import { useRef } from "react"
import { useDispatch } from "react-redux"
import { apiConnector } from "../services/apiConnector"
import { regionEndpoints } from "../services/Apis/regionApis"
import { setLoading } from "../redux/slices/userSlice"
import { subRegionEndpoints } from "../services/Apis/subRegionApis"

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
    // ---------- Region Search for org ( Actually for adding sub region we need region for suggestion ) ----------
    const searchSubRegionForOrg = debounceSearch(
        "searchSubRegionForOrg",
        (searchTerm,filter) =>
            apiConnector(
                "GET",
                `${subRegionEndpoints.SEARCH_SUB_REGIONS}?search=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(filter)}`
            ),
        300 
    )




    return {
        searchMasterRegion,
        searchMasterCountry,
        searchMasterRegionOnly,
        searchRegionForOrg,
        searchSubRegionForOrg
    }
}