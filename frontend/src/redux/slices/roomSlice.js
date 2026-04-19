import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allRooms: {},
  roomTypesForHotelId:{}
}

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {

    // Replace all rooms for a hotel
    setRooms: (state, action) => {
      const { hotelId, rooms } = action.payload
      state.allRooms[hotelId] = rooms
    },

    // Add multiple rooms (without overwriting)
    addRooms: (state, action) => {
      const { hotelId, rooms } = action.payload

      if (!state.allRooms[hotelId]) {
        state.allRooms[hotelId] = []
      }

      state.allRooms[hotelId].push(...rooms)
    },

    // Add single room
    addSingleRoom: (state, action) => {
      const { hotelId, room } = action.payload

      if (!state.allRooms[hotelId]) {
        state.allRooms[hotelId] = []
      }

      state.allRooms[hotelId].push(room)
    },

    // Update a room
    updateRoom: (state, action) => {
      const { hotelId, room } = action.payload

      const rooms = state.allRooms[hotelId]
      if (!rooms) return

      const index = rooms.findIndex(r => r.id === room.id)
      if (index !== -1) {
        rooms[index] = room
      }
    },
    updateSingleRoom: (state, action) => {
      const { hotelId, room } = action.payload || {};

      if (!hotelId || !room?._id) return;

      const rooms = state.allRooms?.[hotelId];
      if (!rooms) return;

      const index = rooms.findIndex(r => r._id === room._id);

      if (index !== -1) {
        rooms[index] = room; // update
      } else {
        rooms.push(room); // add if not exists
      }
    },

    deleteSingleRoom: (state, action) => {
      const { hotelId, roomId } = action.payload || {};

      if (!hotelId || !roomId) return;

      const rooms = state.allRooms?.[hotelId];
      if (!rooms) return;

      const index = rooms.findIndex(r => r._id === roomId);

      if (index !== -1) {
        rooms.splice(index, 1); // ✅ actually removes the room
      }
    },


    deleteRoomForHotel: (state, action) => {
      const { hotelId } = action.payload || {};

      if (!hotelId || !state.allRooms) return;

      delete state.allRooms[hotelId];
    },

    
    setRoomTypesForHotelId: (state, action) => {
      const { key, data } = action.payload;
    
      if (!state.roomTypesForHotelId) {
        state.roomTypesForHotelId = {};
      }
    
      state.roomTypesForHotelId[key] = data;
    }


  }
})

export const {
  setRooms,
  addSingleRoom,
  updateSingleRoom,
  deleteSingleRoom,
  deleteRoomForHotel,
  setRoomTypesForHotelId
} = roomSlice.actions

export default roomSlice.reducer