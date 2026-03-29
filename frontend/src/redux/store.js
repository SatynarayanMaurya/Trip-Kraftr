import { configureStore } from '@reduxjs/toolkit'
import planSlice from './slices/planSlice'
import userSlice from './slices/userSlice'
import organizationSlice from './slices/organizationSlice'
import regionSlice from './slices/regionSlice'
import subRegionSlice from "./slices/subRegionSlice"
import vehilceSlice from './slices/vehicleSlice'
import hotelSlice from './slices/hotelSlice'
import roomSlice from './slices/roomSlice'
import roomRateSlice from './slices/roomRateSlice'
export const store = configureStore({
  reducer: {
    plan: planSlice,
    user: userSlice,
    organization: organizationSlice,
    region: regionSlice,
    subRegion:subRegionSlice,
    vehicle:vehilceSlice,
    hotel:hotelSlice,
    room:roomSlice,
    roomRate:roomRateSlice,
  },
})