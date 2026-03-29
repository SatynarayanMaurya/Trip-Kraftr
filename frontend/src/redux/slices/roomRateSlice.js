import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    allRoomRates: {}

}

export const roomRateSlice = createSlice({
    name: "roomRate",
    initialState,
    reducers: {

        setRoomRates: (state, action) => {
            const { hotelId, roomRateDetails } = action.payload || {};

            if (!hotelId || !roomRateDetails) return;

            state.allRoomRates[hotelId] = roomRateDetails;
        },

        addNewRoomRate: (state, action) => {
            const { hotelId, newRoomRate } = action.payload || {};
            if (!hotelId || !newRoomRate?._id) return;

            if (!state.allRoomRates[hotelId]) {
                state.allRoomRates[hotelId] = []; // initialize if first rate
            }

            state.allRoomRates[hotelId].push(newRoomRate); // safe push
        },

        updateRoomRateReducer: (state, action) => {
            const { hotelId, roomRateDetails } = action.payload || {};
            if (!hotelId || !roomRateDetails?._id) return;

            const hotelRates = state.allRoomRates?.[hotelId];
            if (!hotelRates) return; // nothing to update

            const index = hotelRates.findIndex(r => r._id === roomRateDetails._id);
            if (index !== -1) {
                hotelRates[index] = roomRateDetails; // ✅ safe update
            }
        },

        deleteSingleRoomRate: (state, action) => {
            const { hotelId, deletedRoomRate } = action.payload || {};
            if (!hotelId || !deletedRoomRate?._id) return;

            const hotelRates = state.allRoomRates?.[hotelId];
            if (!hotelRates) return; // nothing to delete

            const index = hotelRates.findIndex(r => r._id === deletedRoomRate._id);
            if (index !== -1) {
                hotelRates.splice(index, 1); // ✅ removes the correct rate
            }
        },



        deleteRoomRateForHotel: (state, action) => {
            const { hotelId } = action.payload || {};

            if (!hotelId || !state.allRoomRates) return;

            delete state.allRoomRates[hotelId];
        }
    }
})

export const {
    setRoomRates,
    addNewRoomRate,
    updateRoomRateReducer,
    deleteSingleRoomRate,
    deleteRoomRateForHotel,

} = roomRateSlice.actions

export default roomRateSlice.reducer