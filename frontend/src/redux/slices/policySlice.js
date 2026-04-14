import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    policiesByRegion: {}
}

export const policySlice = createSlice({
    name: "policy",
    initialState,
    reducers: {

        setPoliciesByRegion: (state, action) => {
            const { category, regionId, policyDetails } = action.payload

            if (!state.policiesByRegion[category]) {
                state.policiesByRegion[category] = {}
            }

            state.policiesByRegion[category][regionId] = policyDetails
        },

        deletePolicyReducer: (state, action) => {
            const { category, regionId, index } = action.payload;
        
            const regionData = state.policiesByRegion?.[category]?.[regionId];
        
            if (
                regionData?.policies &&
                Array.isArray(regionData.policies) &&
                index >= 0 &&
                index < regionData.policies.length
            ) {
                regionData.policies.splice(index, 1);
            }
        }
    }
})

export const { 

    setPoliciesByRegion,
    deletePolicyReducer 

} = policySlice.actions
export default policySlice.reducer