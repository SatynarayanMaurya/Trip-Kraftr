import { configureStore } from '@reduxjs/toolkit'
import planSlice from './slices/planSlice'
import  userSlice  from './slices/userSlice'

export const store = configureStore({
  reducer: {
    plan:planSlice,
    user:userSlice,
  },
})