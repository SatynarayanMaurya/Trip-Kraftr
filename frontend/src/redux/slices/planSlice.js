import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    loading:false,



}

export const planSlice = createSlice({
    name:"plan",
    initialState,
    reducers:{

        setLoading:(state,action)=>{
            state.loading = action.payload
        },


    }
})

export const {setLoading} = planSlice.actions
export default planSlice.reducer