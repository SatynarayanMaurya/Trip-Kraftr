import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allOrganizations: [],
}

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {

    setAllOrganizations: (state, action) => {
      state.allOrganizations = action.payload
    },

    addNewOrganization: (state, action) => {
        state.allOrganizations.unshift(action.payload)
    },
    
    updateOrganization: (state, action) => {
      const index = state.allOrganizations.findIndex(
        org => org._id === action.payload._id
      )
      if (index !== -1) {
        state.allOrganizations[index] = action.payload
      }
    },

    deleteOrganization: (state, action) => {
      state.allOrganizations = state.allOrganizations.filter(
        org => org._id !== action.payload
      )
    },

    clearAllOrganizations: (state) => {
      state.allOrganizations = []
    }

  }
})

export const {
  setAllOrganizations,
  addNewOrganization,
  updateOrganization,
  deleteOrganization,
  clearAllOrganizations
} = organizationSlice.actions

export default organizationSlice.reducer