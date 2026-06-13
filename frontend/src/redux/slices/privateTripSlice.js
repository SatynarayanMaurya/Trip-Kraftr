import { createSlice } from '@reduxjs/toolkit'

const initialState = {



    privateTripByPages: {},

    privateTripById: {}, 
    privateTripFinanceById: {}, 

    privateTripPageLimit: 4,
    currentPagePrivateTrip :1,


    paginationPrivateTrip: {
        currentPage: 1,
        totalPages: 1,
        limit: 4,
        totalRecords: 0
    },
}

export const privateTripSlice = createSlice({
    name: "privateTrip",
    initialState,
    reducers: {

        setCurrentPagePrivateTrip:(state,action)=>{
            state.currentPagePrivateTrip = action.payload
        },

        
        addNewPrivateTrip: (state, action) => {
            const newEntry = action.payload
            const limit = state.privateTripPageLimit || 4

            // 1️⃣ Add to first page
            if (!state.privateTripByPages[1]) {
                state.privateTripByPages[1] = [newEntry]
            } else {
                state.privateTripByPages[1].unshift(newEntry)

                // Handle overflow
                let overflow = state.privateTripByPages[1].slice(limit)
                state.privateTripByPages[1] = state.privateTripByPages[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.privateTripByPages[page]) break

                    state.privateTripByPages[page] = [...overflow, ...state.privateTripByPages[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.privateTripByPages[page].slice(limit)
                    state.privateTripByPages[page] = state.privateTripByPages[page].slice(0, limit)
                    page++
                }
            }

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationPrivateTrip) {
                state.paginationPrivateTrip.totalRecords += 1
                state.paginationPrivateTrip.totalPages = Math.ceil(
                    state.paginationPrivateTrip.totalRecords / limit
                )
            }
        },

        setPrivateTripsByPage: (state, action) => {
            const { page, privateTrips, pagination } = action.payload

            state.privateTripByPages[page] = privateTrips

            if (pagination) state.paginationPrivateTrip = pagination
        },

        setPrivateTripById: (state, action) => {
            const { id, data,financeDetails } = action.payload || {};
            if (!id ) return;

            state.privateTripById[id] = data;
            state.privateTripFinanceById[id] = financeDetails;
        },

        setPrivateTripFinanceById: (state, action) => {
            const { id, data } = action.payload || {};
            if (!id ) return;

            state.privateTripFinanceById[id] = data;
        },


    }
})

export const {
    setCurrentPagePrivateTrip,
    addNewPrivateTrip,
    setPrivateTripsByPage,
    setPrivateTripById,
    setPrivateTripFinanceById
} = privateTripSlice.actions

export default privateTripSlice.reducer