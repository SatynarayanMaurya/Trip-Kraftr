import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    // placesPages: {},
    activitiesPages: {},

    // individualPlaces:{}, // This contain a single place but details about that it is used when we update the place
    individualActivity:{}, // This contain a single place but details about that it is used when we update the place

    activitiesPerPages: 10,

    paginationActivities: {
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        totalRecords: 0
    },

}

export const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers: {

        addNewActivity: (state, action) => {
            const newActivity = action.payload
            const limit = state.paginationActivities?.limit || 5

            // 1️⃣ Add to first page
            if (!state.activitiesPages[1]) {
                state.activitiesPages[1] = [newActivity]
            } else {
                state.activitiesPages[1].unshift(newActivity)

                // Handle overflow
                let overflow = state.activitiesPages[1].slice(limit)
                state.activitiesPages[1] = state.activitiesPages[1].slice(0, limit)

                let page = 2
                while (overflow.length > 0) {
                    if (!state.activitiesPages[page]) state.activitiesPages[page] = []

                    state.activitiesPages[page] = [...overflow, ...state.activitiesPages[page]]

                    // Slice again if this page exceeds limit
                    overflow = state.activitiesPages[page].slice(limit)
                    state.activitiesPages[page] = state.activitiesPages[page].slice(0, limit)
                    page++
                }
            }

            // 3️⃣ Update totalRecords and totalPages in pagination
            if (state.paginationActivities) {
                state.paginationActivities.totalRecords += 1
                state.paginationActivities.totalPages = Math.ceil(
                    state.paginationActivities.totalRecords / limit
                )
            }
        },

        setActivitiesByPage: (state, action) => {
            const { page, activities, pagination } = action.payload

            state.activitiesPages[page] = activities

            if (pagination) state.paginationActivities = pagination
        },

        clearActivity: (state) => {
            state.activitiesPages = {}
            state.paginationActivities = { currentPage: 1, totalPages: 1, limit: 5, totalRecords: 0 }
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

        setActivityPageLimit: (state, action) => {
            state.activitiesPerPages = action.payload
        },

        setIndividualPlaces: (state, action) => {
          const placeDetails = action.payload;
        
          if (!state.individualPlaces) {
            state.individualPlaces = {};
          }
        
          state.individualPlaces[placeDetails._id] = placeDetails;
        }


        


    }
})

export const {
    addNewActivity,
    setActivitiesByPage,
    setActivityPageLimit,
    clearActivity


} = activitySlice.actions

export default activitySlice.reducer