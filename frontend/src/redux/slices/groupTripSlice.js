import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    // hotelsPages: {},
    groupTripsPages: {},

    groupTripById: {}, 
    groupTripSummaryById: {},  

    groupTripPageLimit: 4,


    paginationGroupTrips: {
        currentPage: 1,
        totalPages: 1,
        limit: 4,
        totalRecords: 0
    },
    statsGroupTrips: {
        totalGroupTrips: 0,
    }
}

export const groupTripSlice = createSlice({
    name: "groupTrip",
    initialState,
    reducers: {

        addNewGroupTrip: (state, action) => {
            const newGroupTrip = action.payload;
            const limit = state.HotelPageLimit || 5;

            // ✅ Step 1: Ensure page 1 exists
            if (!state.groupTripsPages[1]) {
                state.groupTripsPages[1] = [newGroupTrip];
            } else {
                // add new hotel at top
                state.groupTripsPages[1].unshift(newGroupTrip);

                let currentPage = 1;

                // ✅ Step 2: Handle overflow ONLY if next page exists
                while (state.groupTripsPages[currentPage]?.length > limit) {
                    const nextPage = currentPage + 1;

                    // ❌ Stop if next page not fetched
                    if (!state.groupTripsPages[nextPage]) {
                        state.groupTripsPages[currentPage] =
                            state.groupTripsPages[currentPage].slice(0, limit);
                        break;
                    }

                    // move last item to next page
                    const overflowItem = state.groupTripsPages[currentPage].pop();

                    state.groupTripsPages[nextPage].unshift(overflowItem);

                    currentPage = nextPage;
                }
            }

            // ✅ Step 3: Update stats
            state.statsGroupTrips.totalGroupTrips += 1;


            // ✅ Step 4: Update pagination
            if (state.paginationGroupTrips) {
                state.paginationGroupTrips.totalRecords += 1;

                state.paginationGroupTrips.totalPages = Math.ceil(
                    state.paginationGroupTrips.totalRecords / limit
                );
            }
        },

        setGroupTripByPage: (state, action) => {
            const { page, groupTrips, pagination, stats } = action.payload

            state.groupTripsPages[page] = groupTrips

            if (pagination) state.paginationGroupTrips = pagination
            if (stats) state.statsGroupTrips = stats
        },

        updateHotel: (state, action) => {
            const updatedHotel = action.payload;
            let found = false;

            for (const page in state.hotelsPages) {
                const pageData = state.hotelsPages[page];

                const index = pageData.findIndex(
                    hotel => hotel._id === updatedHotel._id
                );

                if (index !== -1) {
                    const previousHotel = pageData[index];

                    // ✅ Update stats ONLY if is_active changed
                    if (previousHotel.is_active !== updatedHotel.is_active) {
                        if (updatedHotel.is_active) {
                            state.statsHotels.activeHotel += 1;
                            state.statsHotels.inactiveHotel -= 1;
                        } else {
                            state.statsHotels.activeHotel -= 1;
                            state.statsHotels.inactiveHotel += 1;
                        }
                    }

                    // ✅ Replace hotel
                    pageData[index] = updatedHotel;

                    found = true;
                    break;
                }
            }

            // ✅ If not found → add to first page
            if (!found) {
                const firstPage = 1;
                const limit = state.HotelPageLimit || 4;

                if (!state.hotelsPages[firstPage]) {
                    state.hotelsPages[firstPage] = [updatedHotel];
                } else {
                    state.hotelsPages[firstPage].unshift(updatedHotel);

                    // ✅ Maintain pagination consistency
                    if (state.hotelsPages[firstPage].length > limit) {
                        if (state.hotelsPages[2]) {
                            const overflowItem = state.hotelsPages[firstPage].pop();
                            state.hotelsPages[2].unshift(overflowItem);
                        } else {
                            state.hotelsPages[firstPage] =
                                state.hotelsPages[firstPage].slice(0, limit);
                        }
                    }
                }
            }
        },

        clearGroupTrips: (state, action) => {
            state.groupTripsPages = {}
        },

        setGroupTripPageLimit: (state, action) => {
            state.groupTripPageLimit = Number(action.payload)
        },

        setGroupTripById: (state, action) => {
            const { id, data } = action.payload || {};

            if (!id || !data) return;

            state.groupTripById[id] = data;
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



        setHotelsBySubRegionKey: (state, action) => {
            const { key, data } = action.payload;

            if (!state.hotelsBysubRegionKey) {
                state.hotelsBysubRegionKey = {};
            }

            state.hotelsBysubRegionKey[key] = data;
        }


    }
})

export const {
    addNewGroupTrip,
    setGroupTripByPage,
    setGroupTripPageLimit,
    clearGroupTrips,
    setGroupTripById,
    setGroupTripSummaryById
} = groupTripSlice.actions

export default groupTripSlice.reducer