import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    allOrganizations:null // Only for super admin 



}

export const organizationSlice = createSlice({
    name:"organization",
    initialState,
    reducers:{

        setAllOrganizations:(state,action)=>{
            state.allOrganizations = action.payload
        },
        clearAllOrganizations:(state,action)=>{
            state.allOrganizations = null
        },


    }
})

export const {setAllOrganizations, clearAllOrganizations} = organizationSlice.actions
export default organizationSlice.reducer