import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    loading:false,
    isProduction:import.meta.env.VITE_NODE_ENV === 'production',

    userDetails:null




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


    }
})

export const {setLoading,setUserDetails,clearUserDetails} = userSlice.actions
export default userSlice.reducer