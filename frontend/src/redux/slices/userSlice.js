import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    loading:false,
    isProduction:import.meta.env.VITE_NODE_ENV === 'production',

    userDetails:null,

    allRegionsForSuggestions : null , // This is for suggestion of the region any where you need use it

    allCountryForSuggestions:null




}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{

        setLoading:(state,action)=>{
            state.loading = action.payload
        },

        setUserDetails:(state,action)=>{
            state.userDetails = action.payload
        },

        clearUserDetails:(state,action)=>{
            state.userDetails = null
        },

        setAllRegionsForSuggestions:(state,action)=>{
            state.allRegionsForSuggestions = action.payload
        },

        setAllCountryForSuggestions:(state,action)=>{
            state.allCountryForSuggestions = action.payload
        }


    }
})

export const {  
    setLoading,
    setUserDetails,
    clearUserDetails,
    setAllRegionsForSuggestions,
    setAllCountryForSuggestions


} = userSlice.actions
export default userSlice.reducer