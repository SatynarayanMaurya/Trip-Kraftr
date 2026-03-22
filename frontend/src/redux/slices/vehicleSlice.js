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
    },
    insights: {
        topRegion: {
          name: '',
          country: '',
          regionId: '',
          totalVehicles: 0
        },
        topVehicleType: {
          vehicleType: '',
          totalVehicles: 0
        }
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
            const { page, vehicles, pagination, stats,insights } = action.payload

            state.vehiclesPages[page] = vehicles

            if (pagination) state.paginationVehicles = pagination
            if (stats) state.statsVehicles = stats
            if (insights) state.insights = insights
        },

        addNewVehicle: (state, action) => {
            const newVehicle = action.payload;
            const limit = state.vehiclesPageLimit || 5;
          
            // ✅ Step 1: Ensure page 1 exists
            if (!state.vehiclesPages[1]) {
              state.vehiclesPages[1] = [newVehicle];
            } else {
              // add to top
              state.vehiclesPages[1].unshift(newVehicle);
          
              let currentPage = 1;
          
              // ✅ Step 2: Handle overflow ONLY if next page exists
              while (state.vehiclesPages[currentPage]?.length > limit) {
                const nextPage = currentPage + 1;
          
                // ❌ STOP if next page is NOT already fetched
                if (!state.vehiclesPages[nextPage]) {
                    state.vehiclesPages[currentPage] = state.vehiclesPages[currentPage].slice(0, limit);
                    break;
                }
          
                // overflow item
                const overflowItem = state.vehiclesPages[currentPage].pop();
          
                // push to next page (front)
                state.vehiclesPages[nextPage].unshift(overflowItem);
          
                currentPage = nextPage;
              }
            }
          
            // ✅ Step 3: Update stats
            state.statsVehicles.totalVehicle += 1;
            if (newVehicle.is_active) {
              state.statsVehicles.activeVehicle += 1;
            } else {
              state.statsVehicles.inactiveVehicle += 1;
            }
          
            // ✅ Step 4: Update pagination
            if (state.paginationVehicles) {
              state.paginationVehicles.totalRecords += 1;
              state.paginationVehicles.totalPages = Math.ceil(
                state.paginationVehicles.totalRecords / limit
              );
            }
          },

        setVehiclePageLimit :(state,action)=>{
            state.vehiclesPageLimit = action.payload
        },

        updateVehicle: (state, action) => {
            const updatedVehicle = action.payload;
            let found = false;
          
            for (const page in state.vehiclesPages) {
              const pageData = state.vehiclesPages[page];
          
              const index = pageData.findIndex(
                vehicle => vehicle._id === updatedVehicle._id
              );
          
              if (index !== -1) {
                const previousVehicle = pageData[index];
          
                // ✅ Update stats ONLY if is_active changed
                if (previousVehicle.is_active !== updatedVehicle.is_active) {
                  if (updatedVehicle.is_active) {
                    state.statsVehicles.activeVehicle += 1;
                    state.statsVehicles.inactiveVehicle -= 1;
                  } else {
                    state.statsVehicles.activeVehicle -= 1;
                    state.statsVehicles.inactiveVehicle += 1;
                  }
                }
          
                // ✅ Replace vehicle
                pageData[index] = updatedVehicle;
          
                found = true;
                break;
              }
            }

          
            // ✅ Optional: if not found → add to first page (like subRegion)
            if (!found) {
              const firstPage = 1;
          
              if (!state.vehiclesPages[firstPage]) {
                state.vehiclesPages[firstPage] = [updatedVehicle];
              } else {
                state.vehiclesPages[firstPage].unshift(updatedVehicle);
          
                const limit = state.vehiclesPageLimit || 5;
          
                // ✅ Maintain limit consistency (same as add logic)
                if (state.vehiclesPages[firstPage].length > limit) {
                  if (state.vehiclesPages[2]) {
                    const overflowItem = state.vehiclesPages[firstPage].pop();
                    state.vehiclesPages[2].unshift(overflowItem);
                  } else {
                    // slice if next page not loaded
                    state.vehiclesPages[firstPage] =
                      state.vehiclesPages[firstPage].slice(0, limit);
                  }
                }
              }
            }
        },

        deleteVehicle: (state, action) => {
            const deletedVehicle = action.payload;
            let found = false;
        
            for (const page in state.vehiclesPages) {
                let pageData = state.vehiclesPages[page];
        
                const index = pageData.findIndex(
                    vehicle => vehicle._id === deletedVehicle._id
                );
        
                if (index !== -1) {
                    const removedVehicle = pageData[index];
        
                    // ✅ Update stats
                    if (removedVehicle.is_active) {
                        state.statsVehicles.activeVehicle -= 1;
                    } else {
                        state.statsVehicles.inactiveVehicle -= 1;
                    }
        
                    // ✅ Remove vehicle
                    pageData.splice(index, 1);
        
                    found = true;
        
                    // ✅ Maintain pagination consistency
                    const currentPage = Number(page);
                    let nextPage = currentPage + 1;
        
                    while (state.vehiclesPages[nextPage]?.length) {
                        const nextPageData = state.vehiclesPages[nextPage];
        
                        // Move first item from next page → current page
                        pageData.push(nextPageData.shift());
        
                        // Move forward
                        pageData = state.vehiclesPages[nextPage];
                        nextPage++;
                    }
        
                    break;
                }
            }
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
    clearVehicles,
    updateVehicle,
    deleteVehicle


} = vehilceSlice.actions

export default vehilceSlice.reducer