import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allSubRegions: [],

    subRegionsPages: {},

    subRegionByRegionKey: {},

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

            state.subRegionsPages[page] = subRegions

            if (pagination) state.paginationSubRegions = pagination
            if (stats) state.statsSubRegions = stats
        },

        clearSubRegions: (state) => {
            state.subRegionsPages = {}
            state.paginationSubRegions = { currentPage: 1, totalPages: 1, limit: 5, totalRecords: 0 }
            state.statsSubRegions = { totalSubRegion: 0, activeSubRegion: 0, inactiveSubRegion: 0 }
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
        
        deleteSubRegion: (state, action) => {
            const subRegionId = action.payload;
            const limit = state.paginationSubRegions?.limit || 5;
          
            let deletedPage = null;
          
            // ✅ Step 1: Find & delete
            for (const page in state.subRegionsPages) {
              const pageNum = Number(page);
              const pageData = state.subRegionsPages[pageNum];
          
              const index = pageData.findIndex(
                item => item._id === subRegionId
              );
          
              if (index !== -1) {
                const deletedItem = pageData[index];
          
                // update stats
                if (deletedItem.is_active) {
                  state.statsSubRegions.activeSubRegion--;
                } else {
                  state.statsSubRegions.inactiveSubRegion--;
                }
                state.statsSubRegions.totalSubRegion--;
          
                pageData.splice(index, 1);
                deletedPage = pageNum;
                break;
              }
            }
          
            if (deletedPage === null) return;
          
            // ✅ Step 2: Shift items forward
            let currentPage = deletedPage;
          
            while (state.subRegionsPages[currentPage + 1]) {
              const nextPage = currentPage + 1;
          
              if (state.subRegionsPages[nextPage].length === 0) {
                delete state.subRegionsPages[nextPage];
                break;
              }
          
              // move first item from next page
              const shiftedItem = state.subRegionsPages[nextPage].shift();
              state.subRegionsPages[currentPage].push(shiftedItem);
          
              // if next page becomes empty → delete it
              if (state.subRegionsPages[nextPage].length === 0) {
                delete state.subRegionsPages[nextPage];
                break;
              }
          
              currentPage = nextPage;
            }
          
            // ✅ Step 3: Cleanup empty pages (important)
            for (const page in state.subRegionsPages) {
              if (state.subRegionsPages[page].length === 0) {
                delete state.subRegionsPages[page];
              }
            }
          
            // ✅ Step 4: Update pagination
            if (state.paginationSubRegions) {
              state.paginationSubRegions.totalRecords--;
          
              state.paginationSubRegions.totalPages = Math.max(
                1,
                Math.ceil(state.paginationSubRegions.totalRecords / limit)
              );
          
              // adjust current page if it exceeds totalPages
              if (
                state.paginationSubRegions.currentPage >
                state.paginationSubRegions.totalPages
              ) {
                state.paginationSubRegions.currentPage =
                  state.paginationSubRegions.totalPages;
              }
            }
          },

        setSubRegionPageLimit: (state, action) => {
            state.subRegionsPageLimit = action.payload
        },


        setSubRegionsByRegionKey: (state, action) => {
          const { key, subRegions } = action.payload;
        
          if (!state.subRegionByRegionKey) {
            state.subRegionByRegionKey = {};
          }
        
          state.subRegionByRegionKey[key] = subRegions;
        }

    }
})

export const {
    setAllSubRegions,
    addNewSubRegion,
    setSubRegionsByPage,
    clearSubRegions,
    setSubRegionPageLimit,
    updateSubRegion,
    deleteSubRegion,
    setSubRegionsByRegionKey


} = subRegionSlice.actions

export default subRegionSlice.reducer