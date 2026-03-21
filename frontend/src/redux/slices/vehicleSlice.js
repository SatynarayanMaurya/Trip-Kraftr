import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allVehicles: [],

    allMasterRegions: null,

    vehiclesPages: {},

    vehiclesPageLimit: 4,

    paginationVehicles: {
        currentPage: 1,
        totalPages: 1,
        limit: 4,
        totalRecords: 0
    },
    statsVehicles: {
        totalVehicle: 0,
        activeVehicle: 0,
        inactiveVehicle: 0
    }
}

export const vehilceSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {

        setAllRegions: (state, action) => {
            state.allRegions = action.payload
        },
        
        setVehiclesByPage: (state, action) => {
            const { page, vehicles, pagination, stats } = action.payload

            state.vehiclesPages[page] = vehicles

            if (pagination) state.paginationVehicles = pagination
            if (stats) state.statsVehicles = stats
        },

        addNewVehicle: (state, action) => {
            const newVehicle = action.payload
            const limit = state.paginationVehicles?.limit || 5

            // 1️⃣ Add to first page
            if (!state.vehiclesPages[1]) {
                state.vehiclesPages[1] = [newSubRegion]
            } else {
                state.vehiclesPages[1].unshift(newVehicle)

                // Handle overflow
                let overflow = state.vehiclesPages[1].slice(limit)
                state.vehiclesPages[1] = state.vehiclesPages[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.vehiclesPages[page]) state.vehiclesPages[page] = []

                    state.vehiclesPages[page] = [...overflow, ...state.vehiclesPages[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.vehiclesPages[page].slice(limit)
                    state.vehiclesPages[page] = state.vehiclesPages[page].slice(0, limit)
                    page++
                }
            }

            // 2️⃣ Update stats
            state.statsVehicles.totalVehicle += 1
            if (newVehicle.is_active) state.statsVehicles.activeVehicle += 1
            else state.statsVehicles.inactiveVehicle += 1

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationVehicles) {
                state.paginationVehicles.totalRecords += 1
                state.paginationVehicles.totalPages = Math.ceil(
                    state.paginationVehicles.totalRecords / limit
                )
            }
        },

        setVehiclePageLimit :(state,action)=>{
            state.vehiclesPageLimit = action.payload
        },
        
        clearVehicles: (state) => {
            state.vehiclesPages = {}
            state.paginationVehicles = { currentPage: 1, totalPages: 1, limit: 5, totalRecords: 0 }
            state.statsVehicles = { totalVehicle: 0, activeVehicle: 0, inactiveVehicle: 0 }
        },


    }
})

export const {
    setVehiclesByPage,
    addNewVehicle,
    setVehiclePageLimit,
    clearVehicles


} = vehilceSlice.actions

export default vehilceSlice.reducer