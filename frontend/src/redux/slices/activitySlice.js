import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    activitiesPages: {},
    activitiesBySubRegionKey:{},

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

        updateActivity: (state, action) => {
            const updatedActivity = action.payload;
            // state.individualPlaces[updatePlace?._id] = updatePlace
          
            let found = false;
          
            for (const page in state.activitiesPages) {
                const pageData = state.activitiesPages[page];
              const index = state.activitiesPages[page].findIndex(
                activity => activity._id === updatedActivity._id
              );
          
              if (index !== -1) {
                pageData[index] = updatedActivity;
          
                found = true;
                break;
              }
            }
          
            // Optional: if not found, add to first page
            if (!found) {
              const firstPage = 1;
              if (!state.activitiesPages[firstPage]) {
                state.activitiesPages[firstPage] = [updatedActivity];
              } else {
                state.activitiesPages[firstPage].unshift(updatedActivity);
              }
            }
        },
        
        deleteActivity: (state, action) => {
            const activityId = action.payload;
            const limit = state.paginationActivities?.limit || 5;
          
            let deletedPage = null;
          
            // ✅ Step 1: Find & delete
            for (const page in state.activitiesPages) {
              const pageNum = Number(page);
              const pageData = state.activitiesPages[pageNum];
          
              const index = pageData.findIndex(
                item => item._id === activityId
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
          
            while (state.activitiesPages[currentPage + 1]) {
              const nextPage = currentPage + 1;
          
              if (state.activitiesPages[nextPage].length === 0) {
                delete state.activitiesPages[nextPage];
                break;
              }
          
              // move first item from next page
              const shiftedItem = state.activitiesPages[nextPage].shift();
              state.activitiesPages[currentPage].push(shiftedItem);
          
              // if next page becomes empty → delete it
              if (state.activitiesPages[nextPage].length === 0) {
                delete state.activitiesPages[nextPage];
                break;
              }
          
              currentPage = nextPage;
            }
          
            // ✅ Step 3: Cleanup empty pages (important)
            for (const page in state.activitiesPages) {
              if (state.activitiesPages[page].length === 0) {
                delete state.activitiesPages[page];
              }
            }
          
            // ✅ Step 4: Update pagination
            if (state.paginationActivities) {
              state.paginationActivities.totalRecords--;
          
              state.paginationActivities.totalPages = Math.max(
                1,
                Math.ceil(state.paginationActivities.totalRecords / limit)
              );
          
              // adjust current page if it exceeds totalPages
              if (
                state.paginationActivities.currentPage >
                state.paginationActivities.totalPages
              ) {
                state.paginationActivities.currentPage =
                  state.paginationActivities.totalPages;
              }
            }
          },

        setActivityPageLimit: (state, action) => {
            state.activitiesPerPages = action.payload
        },

        setIndividualActivity: (state, action) => {
          const activityDetails = action.payload;
        
          if (!state.individualActivity) {
            state.individualActivity = {};
          }
        
          state.individualActivity[activityDetails._id] = activityDetails;
        },


        setActivitiesBySubRegionKey: (state, action) => {
          const { key, data } = action.payload;
        
          if (!state.activitiesBySubRegionKey) {
            state.activitiesBySubRegionKey = {};
          }
        
          state.activitiesBySubRegionKey[key] = data;
        }




        


    }
})

export const {
    addNewActivity,
    setActivitiesByPage,
    setActivityPageLimit,
    clearActivity,
    deleteActivity,
    setIndividualActivity,
    updateActivity,
    setActivitiesBySubRegionKey


} = activitySlice.actions

export default activitySlice.reducer