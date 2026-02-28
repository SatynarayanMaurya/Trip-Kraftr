import { Route } from "react-router-dom"
import Hotels from "../pages/Hotels"
import AddHotel from "../components/Hotels/AddHotel"
import ChooseHotelType from "../components/Hotels/ChooseHotelType"

export const hotelRoutes = (
  <Route path="hotels">
    <Route index element={<Hotels />} />
    <Route path="add-hotel">
      <Route index element={<AddHotel/>} />
      <Route path="self" element={<ChooseHotelType />} />
    </Route>
  </Route>
)