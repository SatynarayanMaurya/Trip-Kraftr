import { useRef } from "react"
import { useDispatch } from "react-redux"
import { apiConnector } from "../services/apiConnector"
import { regionEndpoints } from "../services/Apis/regionApis"
import { setLoading } from "../redux/slices/userSlice"

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


    // ---------- Hotel Search (example) ----------
    //   const searchHotel = debounceSearch(
    //     "searchHotel",
    //     (searchTerm) =>
    //       apiConnector(
    //         "GET",
    //         `/hotel/search?query=${encodeURIComponent(searchTerm)}`
    //       )
    //   )

    return {
        searchMasterRegion,
    }
}