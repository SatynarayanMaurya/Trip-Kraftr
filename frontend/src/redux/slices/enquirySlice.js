import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    openTab: 'b2b',
    b2bEnquiriesByPage: {},
    b2cEnquiriesByPage: {},
    b2bEnquiryByIds: {},
    b2cEnquiryByIds: {},


    b2bEnquiryPerPages: 5,
    b2cEnquiryPerPages: 5,

    paginationB2B: {
        currentPage: 1,
        totalPages: 1,
        limit: 5,
        totalRecords: 0
    },

    paginationB2C: {
        currentPage: 1,
        totalPages: 1,
        limit: 5,
        totalRecords: 0
    },

}

export const enquirySlice = createSlice({
    name: "enquiry",
    initialState,
    reducers: {

        setOpenTab: (state, action) => {
            state.openTab = action.payload;
        },

        addNewB2BEnquiry: (state, action) => {
            const newData = action.payload
            const limit = state.b2bEnquiryPerPages || 5

            // 1️⃣ Add to first page
            if (!state.b2bEnquiriesByPage[1]) {
                // state.b2bAccountsByPage[1] = [newData]
            } else {
                state.b2bEnquiriesByPage[1].unshift(newData)

                // Handle overflow
                let overflow = state.b2bEnquiriesByPage[1].slice(limit)
                state.b2bEnquiriesByPage[1] = state.b2bEnquiriesByPage[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.b2bEnquiriesByPage[page]) break;

                    state.b2bEnquiriesByPage[page] = [...overflow, ...state.b2bEnquiriesByPage[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.b2bEnquiriesByPage[page].slice(limit)
                    state.b2bEnquiriesByPage[page] = state.b2bEnquiriesByPage[page].slice(0, limit)
                    page++
                }
            }

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationB2B) {
                state.paginationB2B.totalRecords += 1
                state.paginationB2B.totalPages = Math.ceil(
                    state.paginationB2B.totalRecords / limit
                )
            }
        },

        addNewB2CEnquiry: (state, action) => {
            const newData = action.payload
            const limit = state.b2cEnquiryPerPages || 5

            // 1️⃣ Add to first page
            if (!state.b2cEnquiriesByPage[1]) {
                // state.b2bAccountsByPage[1] = [newData]
            } else {
                state.b2cEnquiriesByPage[1].unshift(newData)

                // Handle overflow
                let overflow = state.b2cEnquiriesByPage[1].slice(limit)
                state.b2cEnquiriesByPage[1] = state.b2cEnquiriesByPage[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.b2cEnquiriesByPage[page]) break;

                    state.b2cEnquiriesByPage[page] = [...overflow, ...state.b2cEnquiriesByPage[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.b2cEnquiriesByPage[page].slice(limit)
                    state.b2cEnquiriesByPage[page] = state.b2cEnquiriesByPage[page].slice(0, limit)
                    page++
                }
            }

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationB2C) {
                state.paginationB2C.totalRecords += 1
                state.paginationB2C.totalPages = Math.ceil(
                    state.paginationB2C.totalRecords / limit
                )
            }
        },


        setB2BEnquiriesByPage: (state, action) => {
            const { page, data, pagination } = action.payload

            state.b2bEnquiriesByPage[page] = data
            state.paginationB2B = pagination

        },

        setB2CEnquiriesByPage: (state, action) => {
            const { page, data, pagination } = action.payload

            state.b2cEnquiriesByPage[page] = data
            state.paginationB2C = pagination

        },


        setB2BAccountPageLimit: (state, action) => {
            state.b2bAccountPerPages = action.payload;
        },

        setB2CAccountPageLimit: (state, action) => {
            state.b2cAccountPerPages = action.payload;
        },

        clearB2BAccounts: (state, action) => {
            state.b2bAccountsByPage = {}
        },

        clearB2CAccounts: (state, action) => {
            state.b2cAccountsByPage = {}
        },

        setB2BAccountById: (state, action) => {
            const { _id, data } = action.payload;

            if (!_id) return;

            if (!state.b2bAccountsByIds) {
                state.b2bAccountsByIds = {};
            }

            state.b2bAccountsByIds[_id] = data;
        },

        setB2CAccountById: (state, action) => {
            const { _id, data } = action.payload;

            if (!_id) return;

            if (!state.b2cAccountsByIds) {
                state.b2cAccountsByIds = {};
            }

            state.b2cAccountsByIds[_id] = data;
        },






    }
})

export const {
    setOpenTab,
    addNewB2BEnquiry,
    addNewB2CEnquiry,
    setB2BEnquiriesByPage,
    setB2CEnquiriesByPage


} = enquirySlice.actions

export default enquirySlice.reducer