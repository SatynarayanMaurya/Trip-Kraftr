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

export const hotelSlice = createSlice({
    name: "hotel",
    initialState,
    reducers: {

        addNewHotel: (state, action) => {
            const newHotel = action.payload;
            const limit = state.HotelPageLimit || 5;
          
            // ✅ Step 1: Ensure page 1 exists
            if (!state.hotelsPages[1]) {
              state.hotelsPages[1] = [newHotel];
            } else {
              // add new hotel at top
              state.hotelsPages[1].unshift(newHotel);
          
              let currentPage = 1;
          
              // ✅ Step 2: Handle overflow ONLY if next page exists
              while (state.hotelsPages[currentPage]?.length > limit) {
                const nextPage = currentPage + 1;
          
                // ❌ Stop if next page not fetched
                if (!state.hotelsPages[nextPage]) {
                  state.hotelsPages[currentPage] =
                    state.hotelsPages[currentPage].slice(0, limit);
                  break;
                }
          
                // move last item to next page
                const overflowItem = state.hotelsPages[currentPage].pop();
          
                state.hotelsPages[nextPage].unshift(overflowItem);
          
                currentPage = nextPage;
              }
            }
          
            // ✅ Step 3: Update stats
            state.statsHotels.totalHotel += 1;
          
            if (newHotel.is_active) {
              state.statsHotels.activeHotel += 1;
            } else {
              state.statsHotels.inactiveHotel += 1;
            }
          
            // ✅ Step 4: Update pagination
            if (state.paginationHotels) {
              state.paginationHotels.totalRecords += 1;
          
              state.paginationHotels.totalPages = Math.ceil(
                state.paginationHotels.totalRecords / limit
              );
            }
          },

        setHotelsByPage: (state, action) => {
            const { page, hotels, pagination, stats } = action.payload

            state.hotelsPages[page] = hotels

            if (pagination) state.paginationHotels = pagination
            if (stats) state.statsHotels = stats
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

        clearHotels :(state,action)=>{
            state.hotelsPages = {}
        },



        setHotelPageLimit :  (state,action)=>{
            state.HotelPageLimit = Number(action.payload)
        }

    }
})

export const {
    addNewHotel,
    setHotelsByPage,
    clearHotels,
    setHotelPageLimit,
    updateHotel

} = hotelSlice.actions

export default hotelSlice.reducer