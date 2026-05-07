import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    openTab: 'b2b',
    b2bAccountsByPage: {},
    b2cAccountsByPage: {},
    b2bAccountsByIds: {},
    b2cAccountsByIds: {},

    individualActivity: {}, // This contain a single place but details about that it is used when we update the place

    b2bAccountPerPages: 10,
    b2cAccountPerPages: 10,

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

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {

        setOpenTab: (state, action) => {
            state.openTab = action.payload;
        },

        addNewB2BAccount: (state, action) => {
            const newData = action.payload
            const limit = state.b2bAccountPerPages || 5

            // 1️⃣ Add to first page
            if (!state.b2bAccountsByPage[1]) {
                // state.b2bAccountsByPage[1] = [newData]
            } else {
                state.b2bAccountsByPage[1].unshift(newData)

                // Handle overflow
                let overflow = state.b2bAccountsByPage[1].slice(limit)
                state.b2bAccountsByPage[1] = state.b2bAccountsByPage[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.b2bAccountsByPage[page]) break;

                    state.b2bAccountsByPage[page] = [...overflow, ...state.b2bAccountsByPage[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.b2bAccountsByPage[page].slice(limit)
                    state.b2bAccountsByPage[page] = state.b2bAccountsByPage[page].slice(0, limit)
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

        addNewB2CAccount: (state, action) => {
            const newData = action.payload
            const limit = state.b2cAccountPerPages || 5

            // 1️⃣ Add to first page
            if (!state.b2cAccountsByPage[1]) {
            } else {
                state.b2cAccountsByPage[1].unshift(newData)

                // Handle overflow
                let overflow = state.b2cAccountsByPage[1].slice(limit)
                state.b2cAccountsByPage[1] = state.b2cAccountsByPage[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.b2cAccountsByPage[page]) break;

                    state.b2cAccountsByPage[page] = [...overflow, ...state.b2cAccountsByPage[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.b2cAccountsByPage[page].slice(limit)
                    state.b2cAccountsByPage[page] = state.b2cAccountsByPage[page].slice(0, limit)
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

        setB2BAccountsByPage: (state, action) => {
            const { page, data, pagination } = action.payload

            state.b2bAccountsByPage[page] = data
            state.paginationB2B = pagination

        },

        setB2CAccountsByPage: (state, action) => {
            const { page, data, pagination } = action.payload

            state.b2cAccountsByPage[page] = data
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
    addNewB2BAccount,
    addNewB2CAccount,
    setB2BAccountsByPage,
    setB2CAccountsByPage,
    setB2BAccountPageLimit,
    setB2CAccountPageLimit,
    clearB2BAccounts,
    clearB2CAccounts,
    setB2BAccountById,
    setB2CAccountById


} = accountSlice.actions

export default accountSlice.reducer