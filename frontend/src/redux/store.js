import { configureStore } from '@reduxjs/toolkit'
import planSlice from './slices/planSlice'
import userSlice  from './slices/userSlice'
import organizationSlice from './slices/organizationSlice'

export const store = configureStore({
  reducer: {
    plan:planSlice,
    user:userSlice,
    organization:organizationSlice
  },
})