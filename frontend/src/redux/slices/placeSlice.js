import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    placesPages: {},
    placesBySubRegionKey:{},

    individualPlaces:{}, // This contain a single place but details about that it is used when we update the place

    placesPageLimit: 10,

    paginationPlaces: {
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        totalRecords: 0
    },

}

export const placeSlice = createSlice({
    name: "place",
    initialState,
    reducers: {

        addNewPlace: (state, action) => {
            const newPlace = action.payload
            const limit = state.paginationPlaces?.limit || 5

            // 1️⃣ Add to first page
            if (!state.placesPages[1]) {
                state.placesPages[1] = [newPlace]
            } else {
                state.placesPages[1].unshift(newPlace)

                // Handle overflow
                let overflow = state.placesPages[1].slice(limit)
                state.placesPages[1] = state.placesPages[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.placesPages[page]) state.placesPages[page] = []

                    state.placesPages[page] = [...overflow, ...state.placesPages[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.placesPages[page].slice(limit)
                    state.placesPages[page] = state.placesPages[page].slice(0, limit)
                    page++
                }
            }

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationPlaces) {
                state.paginationPlaces.totalRecords += 1
                state.paginationPlaces.totalPages = Math.ceil(
                    state.paginationPlaces.totalRecords / limit
                )
            }
        },

        setPlacesByPage: (state, action) => {
            const { page, places, pagination } = action.payload

            state.placesPages[page] = places

            if (pagination) state.paginationPlaces = pagination
        },

        clearPlaces: (state) => {
            state.placesPages = {}
            state.paginationPlaces = { currentPage: 1, totalPages: 1, limit: 5, totalRecords: 0 }
        },

        updatePlace: (state, action) => {
            const updatedPlace = action.payload;
            // state.individualPlaces[updatePlace?._id] = updatePlace
          
            let found = false;
          
            for (const page in state.placesPages) {
                const pageData = state.placesPages[page];
              const index = state.placesPages[page].findIndex(
                place => place._id === updatedPlace._id
              );
          
              if (index !== -1) {
                pageData[index] = updatedPlace;
          
                found = true;
                break;
              }
            }
          
            // Optional: if not found, add to first page
            if (!found) {
              const firstPage = 1;
              if (!state.placesPages[firstPage]) {
                state.placesPages[firstPage] = [updatedPlace];
              } else {
                state.placesPages[firstPage].unshift(updatedPlace);
              }
            }
        },
        
        deletePlace: (state, action) => {
            const placeId = action.payload;
            const limit = state.paginationPlaces?.limit || 5;
          
            let deletedPage = null;
          
            // ✅ Step 1: Find & delete
            for (const page in state.placesPages) {
              const pageNum = Number(page);
              const pageData = state.placesPages[pageNum];
          
              const index = pageData.findIndex(
                item => item._id === placeId
              );
          
              if (index !== -1) {
                pageData.splice(index, 1);
                deletedPage = pageNum;
                break;
              }
            }
          
            if (deletedPage === null) return;
          
            // ✅ Step 2: Shift items forward
            let currentPage = deletedPage;
          
            while (state.placesPages[currentPage + 1]) {
              const nextPage = currentPage + 1;
          
              if (state.placesPages[nextPage].length === 0) {
                delete state.placesPages[nextPage];
                break;
              }
          
              // move first item from next page
              const shiftedItem = state.placesPages[nextPage].shift();
              state.placesPages[currentPage].push(shiftedItem);
          
              // if next page becomes empty → delete it
              if (state.placesPages[nextPage].length === 0) {
                delete state.placesPages[nextPage];
                break;
              }
          
              currentPage = nextPage;
            }
          
            // ✅ Step 3: Cleanup empty pages (important)
            for (const page in state.placesPages) {
              if (state.placesPages[page].length === 0) {
                delete state.placesPages[page];
              }
            }
          
            // ✅ Step 4: Update pagination
            if (state.paginationPlaces) {
              state.paginationPlaces.totalRecords--;
          
              state.paginationPlaces.totalPages = Math.max(
                1,
                Math.ceil(state.paginationPlaces.totalRecords / limit)
              );
          
              // adjust current page if it exceeds totalPages
              if (
                state.paginationPlaces.currentPage >
                state.paginationPlaces.totalPages
              ) {
                state.paginationPlaces.currentPage =
                  state.paginationPlaces.totalPages;
              }
            }
          },

        setPlacePageLimit: (state, action) => {
            state.placesPageLimit = action.payload
        },

        setIndividualPlaces: (state, action) => {
          const placeDetails = action.payload;
        
          if (!state.individualPlaces) {
            state.individualPlaces = {};
          }
        
          state.individualPlaces[placeDetails._id] = placeDetails;
        },

        
        setPlacesBySubRegionKey: (state, action) => {
          const { key, data } = action.payload;
        
          if (!state.placesBySubRegionKey) {
            state.placesBySubRegionKey = {};
          }
        
          state.placesBySubRegionKey[key] = data;
        }


        


    }
})

export const {
    
    setPlacesByPage,
    addNewPlace,
    setPlacePageLimit,
    clearPlaces,
    deletePlace,
    setIndividualPlaces,
    updatePlace,
    setPlacesBySubRegionKey


} = placeSlice.actions

export default placeSlice.reducer