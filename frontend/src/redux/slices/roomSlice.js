import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allRooms: {}
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
    addRoom: (state, action) => {
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

    // Delete a room
    removeRoom: (state, action) => {
      const { hotelId, roomId } = action.payload

      const rooms = state.allRooms[hotelId]
      if (!rooms) return

      state.allRooms[hotelId] = rooms.filter(r => r.id !== roomId)
    }

  }
})

export const {
    setRooms
} = roomSlice.actions

export default roomSlice.reducer