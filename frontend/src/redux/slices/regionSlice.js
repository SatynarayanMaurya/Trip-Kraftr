import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allRegions: [],

    allMasterRegions: null,

    masterRegionsPages: {},

    masterRegionsPageLimit: 5,

    paginationMasterRegions: {
        currentPage: 1,
        totalPages: 1,
        limit: 5,
        totalRecords: 0
    },
    statsMasterRegions: {
        totalRegion: 0,
        activeRegion: 0,
        inactiveRegion: 0
    }
}

export const regionSlice = createSlice({
    name: "region",
    initialState,
    reducers: {

        setAllRegions: (state, action) => {
            state.allRegions = action.payload
        },

        addNewRegion: (state, action) => {
            state.allRegions.unshift(action.payload)
        },

        updateRegion: (state, action) => {
            const updatedRegion = action.payload;
            const index = state.allRegions.findIndex(region => region._id === updatedRegion?._id);
            if (index !== -1) {
                state.allRegions[index] = updatedRegion;
            } else {
                state.allRegions.unshift(updatedRegion);
            }
        },

        deleteRegion: (state, action) => {
            const deletedRegion = action.payload;
            state.allRegions = state.allRegions.filter(
                region => region._id !== deletedRegion?._id
            );
        },


        clearAllRegions: (state) => {
            state.allRegions = []
        },

        addNewMasterRegion: (state, action) => {
            const newRegion = action.payload
            const limit = state.paginationMasterRegions?.limit || 5

            // 1️⃣ Add to first page
            if (!state.masterRegionsPages[1]) {
                state.masterRegionsPages[1] = [newRegion]
            } else {
                state.masterRegionsPages[1].unshift(newRegion)

                // Handle overflow
                let overflow = state.masterRegionsPages[1].slice(limit)
                state.masterRegionsPages[1] = state.masterRegionsPages[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.masterRegionsPages[page]) state.masterRegionsPages[page] = []

                    state.masterRegionsPages[page] = [...overflow, ...state.masterRegionsPages[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.masterRegionsPages[page].slice(limit)
                    state.masterRegionsPages[page] = state.masterRegionsPages[page].slice(0, limit)
                    page++
                }
            }

            // 2️⃣ Update stats
            state.statsMasterRegions.totalRegion += 1
            if (newRegion.is_active) state.statsMasterRegions.activeRegion += 1
            else state.statsMasterRegions.inactiveRegion += 1

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationMasterRegions) {
                state.paginationMasterRegions.totalRecords += 1
                state.paginationMasterRegions.totalPages = Math.ceil(
                    state.paginationMasterRegions.totalRecords / limit
                )
            }
        },

        setMasterRegionsByPage: (state, action) => {
            const { page, regions, pagination, stats } = action.payload

            // store page data
            state.masterRegionsPages[page] = regions

            // update pagination & stats
            if (pagination) state.paginationMasterRegions = pagination
            if (stats) state.statsMasterRegions = stats
        },

        clearMasterRegions: (state) => {
            state.masterRegionsPages = {}
            state.paginationMasterRegions = { currentPage: 1, totalPages: 1, limit: 5, totalRecords: 0 }
            state.statsMasterRegions = { totalRegion: 0, activeRegion: 0, inactiveRegion: 0 }
        },

        setMasteRegionPageLimit: (state, action) => {
            state.masterRegionsPageLimit = action.payload
        }

    }
})

export const {
    setAllRegions,
    addNewRegion,
    clearAllRegions,
    addNewMasterRegion,
    updateRegion,
    deleteRegion,

    setMasteRegionPageLimit,

    setMasterRegionsByPage,
    clearMasterRegions

} = regionSlice.actions

export default regionSlice.reducer