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
import placeSlice from './slices/placeSlice'
import activitySlice from './slices/activitySlice'
import policySlice from './slices/policySlice'
import groupTripSlice from './slices/groupTripSlice'
import accountSlice from './slices/accountSlice'
import enquirySlice from './slices/enquirySlice'
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
    place:placeSlice,
    activity:activitySlice,
    policy:policySlice,
    groupTrip:groupTripSlice,
    account:accountSlice,
    enquiry:enquirySlice,
  },
})