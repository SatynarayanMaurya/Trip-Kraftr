import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    // hotelsPages: {},
    groupTripsPages: {},

    samplePackagesByPages: {},

    groupTripById: {}, 

    groupTripSummaryById: {},  
    samplePackageById: {}, 
    suggestionGroupTripsSlice:{},

    samplePackagePageLimit: 4,
    currentPageSamplePackage :1,


    paginationSamplePackages: {
        currentPage: 1,
        totalPages: 1,
        limit: 4,
        totalRecords: 0
    },
}

export const samplePackageSlice = createSlice({
    name: "samplePackage",
    initialState,
    reducers: {

        setCurrentPageSamplePackage:(state,action)=>{
            state.currentPageSamplePackage = action.payload
        },

        
        addNewSamplePackage: (state, action) => {
            const newEntry = action.payload
            const limit = state.samplePackagePageLimit || 4

            // 1️⃣ Add to first page
            if (!state.samplePackagesByPages[1]) {
                state.samplePackagesByPages[1] = [newEntry]
            } else {
                state.samplePackagesByPages[1].unshift(newEntry)

                // Handle overflow
                let overflow = state.samplePackagesByPages[1].slice(limit)
                state.samplePackagesByPages[1] = state.samplePackagesByPages[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.samplePackagesByPages[page]) break

                    state.samplePackagesByPages[page] = [...overflow, ...state.samplePackagesByPages[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.samplePackagesByPages[page].slice(limit)
                    state.samplePackagesByPages[page] = state.samplePackagesByPages[page].slice(0, limit)
                    page++
                }
            }

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationSamplePackages) {
                state.paginationSamplePackages.totalRecords += 1
                state.paginationSamplePackages.totalPages = Math.ceil(
                    state.paginationSamplePackages.totalRecords / limit
                )
            }
        },

        setSamplePackageByPage: (state, action) => {
            const { page, samplePackages, pagination } = action.payload

            state.samplePackagesByPages[page] = samplePackages

            if (pagination) state.paginationSamplePackages = pagination
        },

        setSamplePackageById: (state, action) => {
            const { id, data } = action.payload || {};
            if (!id ) return;

            state.samplePackageById[id] = data;
        },


    }
})

export const {
    addNewSamplePackage,
    setCurrentPageSamplePackage,
    setSamplePackageByPage,
    setSamplePackageById,
    
} = samplePackageSlice.actions

export default samplePackageSlice.reducer