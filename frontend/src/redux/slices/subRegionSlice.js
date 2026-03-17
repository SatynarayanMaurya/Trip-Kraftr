import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allSubRegions: [],

    subRegionsPages: {},

    subRegionsPageLimit: 5,

    paginationSubRegions: {
        currentPage: 1,
        totalPages: 1,
        limit: 5,
        totalRecords: 0
    },
    statsSubRegions: {
        totalSubRegion: 0,
        activeSubRegion: 0,
        inactiveSubRegion: 0
    }

}

export const subRegionSlice = createSlice({
    name: "subRegion",
    initialState,
    reducers: {

        setAllSubRegions: (state, action) => {
            state.allSubRegions = action.payload
        },

        addNewSubRegion: (state, action) => {
            const newSubRegion = action.payload
            const limit = state.paginationSubRegions?.limit || 5

            // 1️⃣ Add to first page
            if (!state.subRegionsPages[1]) {
                state.subRegionsPages[1] = [newSubRegion]
            } else {
                state.subRegionsPages[1].unshift(newSubRegion)

                // Handle overflow
                let overflow = state.subRegionsPages[1].slice(limit)
                state.subRegionsPages[1] = state.subRegionsPages[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.subRegionsPages[page]) state.subRegionsPages[page] = []

                    state.subRegionsPages[page] = [...overflow, ...state.subRegionsPages[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.subRegionsPages[page].slice(limit)
                    state.subRegionsPages[page] = state.subRegionsPages[page].slice(0, limit)
                    page++
                }
            }

            // 2️⃣ Update stats
            state.statsSubRegions.totalSubRegion += 1
            if (newSubRegion.is_active) state.statsSubRegions.activeSubRegion += 1
            else state.statsSubRegions.inactiveSubRegion += 1

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationSubRegions) {
                state.paginationSubRegions.totalRecords += 1
                state.paginationSubRegions.totalPages = Math.ceil(
                    state.paginationSubRegions.totalRecords / limit
                )
            }
        },

        setSubRegionsByPage: (state, action) => {
            const { page, subRegions, pagination, stats } = action.payload

            // store page data
            state.subRegionsPages[page] = subRegions

            // update pagination & stats
            if (pagination) state.paginationSubRegions = pagination
            if (stats) state.statsSubRegions = stats
        },

        clearSubRegions: (state) => {
            state.subRegionsPages = {}
            state.paginationSubRegions = { currentPage: 1, totalPages: 1, limit: 5, totalRecords: 0 }
            state.statsMasstatsSubRegionsterRegions = { totalSubRegion: 0, activeSubRegion: 0, inactiveSubRegion: 0 }
        },

        updateSubRegion: (state, action) => {
            const updatedSubRegion = action.payload;
          
            let found = false;
          
            for (const page in state.subRegionsPages) {
                const pageData = state.subRegionsPages[page];
              const index = state.subRegionsPages[page].findIndex(
                subRegion => subRegion._id === updatedSubRegion._id
              );
          
              if (index !== -1) {
                const previousSubRegion = pageData[index];
          
                // ✅ Update stats ONLY if is_active changed
                if (previousSubRegion.is_active !== updatedSubRegion.is_active) {
                  if (updatedSubRegion.is_active) {
                    state.statsSubRegions.activeSubRegion += 1;
                    state.statsSubRegions.inactiveSubRegion -= 1;
                  } else {
                    state.statsSubRegions.activeSubRegion -= 1;
                    state.statsSubRegions.inactiveSubRegion += 1;
                  }
                }
          
                // ✅ Update actual data
                pageData[index] = updatedSubRegion;
          
                found = true;
                break;
              }
            }
          
            // Optional: if not found, add to first page
            if (!found) {
              const firstPage = 1;
              if (!state.subRegionsPages[firstPage]) {
                state.subRegionsPages[firstPage] = [updatedSubRegion];
              } else {
                state.subRegionsPages[firstPage].unshift(updatedSubRegion);
              }
            }
          },

        setSubRegionPageLimit: (state, action) => {
            state.subRegionsPageLimit = action.payload
        }


    }
})

export const {
    setAllSubRegions,
    addNewSubRegion,
    setSubRegionsByPage,
    clearSubRegions,
    setSubRegionPageLimit,
    updateSubRegion


} = subRegionSlice.actions

export default subRegionSlice.reducer