import { Route } from "react-router-dom"
import Hotels from "../pages/Hotels"
import AddHotel from "../components/Hotels/AddHotel"
import ChooseHotelType from "../components/Hotels/ChooseHotelType"
import Plans from "../pages/Plans"
import CreatePlan from "../components/Plans/CreatePlan"

export const planRoutes = (
  <Route path="plans">
    <Route index element={<Plans />} />
    <Route path="add-plan" element={<CreatePlan/>}></Route>
  </Route>
)