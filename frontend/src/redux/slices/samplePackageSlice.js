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

        updateGroupTrip: (state, action) => {
            const updatedGroupTrip = action.payload;
            let found = false;

            for (const page in state.groupTripsPages) {
                const pageData = state.groupTripsPages[page];

                const index = pageData.findIndex(
                    groupTrip => groupTrip._id === updatedGroupTrip._id
                );

                if (index !== -1) {
                    // ✅ Replace hotel
                    pageData[index] = updatedGroupTrip;

                    found = true;
                    break;
                }
            }

            state.groupTripById[updatedGroupTrip?._id] = updatedGroupTrip
        },

        clearGroupTrips: (state, action) => {
            state.groupTripsPages = {}
        },


        setSamplePackageById: (state, action) => {
            const { id, data } = action.payload || {};
            if (!id ) return;

            state.samplePackageById[id] = data;
        },
        removeGroupTripById: (state, action) => {
            const { id } = action.payload || {};
        
            if (!id) return;
        
            delete state.groupTripById[id];
        },

        setGroupTripSummaryById: (state, action) => {
            const { id, data } = action.payload || {};

            if (!id || !data) return;

            state.groupTripSummaryById[id] = data;
        },

        deleteHotelReducer: (state, action) => {
            const deletedHotel = action.payload;
            let found = false;

            for (const page in state.hotelsPages) {
                let pageData = state.hotelsPages[page];

                const index = pageData.findIndex(
                    hotel => hotel._id === deletedHotel._id
                );

                if (index !== -1) {
                    const removedHotel = pageData[index];

                    // ✅ Update stats
                    if (removedHotel.is_active) {
                        state.statsHotels.activeHotel -= 1;
                    } else {
                        state.statsHotels.inactiveHotel -= 1;
                    }

                    state.statsHotels.totalHotel -= 1;

                    // ✅ Remove hotel
                    pageData.splice(index, 1);

                    found = true;

                    // ✅ Maintain pagination consistency
                    const currentPage = Number(page);
                    let nextPage = currentPage + 1;

                    while (state.hotelsPages[nextPage]?.length) {
                        const nextPageData = state.hotelsPages[nextPage];

                        // Move first item from next page → current page
                        pageData.push(nextPageData.shift());

                        // Move forward
                        pageData = state.hotelsPages[nextPage];
                        nextPage++;
                    }

                    break;
                }
            }

            // ✅ Update pagination
            if (found && state.paginationHotels) {
                state.paginationHotels.totalRecords -= 1;

                const limit = state.HotelPageLimit || 4;

                state.paginationHotels.totalPages = Math.ceil(
                    state.paginationHotels.totalRecords / limit
                );
            }
        },



        setSuggestionGroupTripByRegionId: (state, action) => {
            const { key, data } = action.payload;

            if (!state.suggestionGroupTripsSlice) {
                state.suggestionGroupTripsSlice = {};
            }

            state.suggestionGroupTripsSlice[key] = data;
        },


        setUpdateGroupTripStatus:(state,action)=>{
            const {status,groupTripId} = action.payload;
            let data = state.groupTripById?.[groupTripId]
            if(data){
                data.status = status
            }
        },

        setUpdateGroupTripStatusForPages: (state, action) => {
            const { status, groupTripId } = action.payload;
        
            for (const page in state.groupTripsPages) {
                const pageData = state.groupTripsPages[page];
        
                const trip = pageData.find(
                    (groupTrip) => groupTrip._id === groupTripId
                );
        
                if (trip) {
                    trip.status = status;
                    break;
                }
            }
        },

        setUpdateGroupTripStatusEverywhere: (state, action) => {
            const { status, groupTripId } = action.payload;
        
            // Update normalized state
            const trip = state.groupTripById?.[groupTripId];
            if (trip) {
                trip.status = status;
            }
        
            // Update paginated state
            for (const page in state.groupTripsPages) {
                const pageData = state.groupTripsPages[page];
        
                const item = pageData.find(
                    (groupTrip) => groupTrip._id === groupTripId
                );
        
                if (item) {
                    item.status = status;
                    break;
                }
            }
        }


    }
})

export const {
    addNewSamplePackage,
    setCurrentPageSamplePackage,
    setSamplePackageByPage,
    setSamplePackageById,
    
} = samplePackageSlice.actions

export default samplePackageSlice.reducer