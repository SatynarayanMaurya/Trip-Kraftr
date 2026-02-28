import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    loading:false,
    NODE_ENV:  import.meta.env.VITE_NODE_ENV||"developement",
    isProduction:import.meta.env.VITE_NODE_ENV === 'production'



}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{

        setLoading:(state,action)=>{
            state.loading = action.payload
        },


    }
})

export const {setLoading} = userSlice.actions
export default userSlice.reducer