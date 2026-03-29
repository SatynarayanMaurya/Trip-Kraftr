import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    hotelsPages: {},

    HotelPageLimit: 4,

    paginationHotels: {
        currentPage: 1,
        totalPages: 1,
        limit: 4,
        totalRecords: 0
    },
    statsHotels: {
        totalHotel: 0,
        activeHotel: 0,
        inactiveHotel: 0
    },

}

export const roomRateSlice = createSlice({
    name: "roomRate",
    initialState,
    reducers: {


    }
})

export const {


} = roomRateSlice.actions

export default roomRateSlice.reducer