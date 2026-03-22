
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { vehicleEndpoinsts } from '../services/Apis/vehicleApis'
import { addNewVehicle, deleteVehicle, setVehiclesByPage, updateVehicle } from '../redux/slices/vehicleSlice'

export const useVehicleHooks = () => {
  const dispatch = useDispatch();
  const vehiclesPages = useSelector((state)=>state.vehicle.vehiclesPages)

  const addVehicle = async (vehicleDetails) => {  // For Normal Org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", vehicleEndpoinsts.ADD_VEHICLE, vehicleDetails)
      dispatch(addNewVehicle(response?.data?.newVehicle))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
  
  const getVehicles = async (page = 1, limit = 5) => {  // For super admin only
    try {
      const cachedPage = vehiclesPages?.[page]

      if (cachedPage) return cachedPage   // 🚀 return cached data

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${vehicleEndpoinsts.GET_VEHICLE}?page=${page}&limit=${limit}`
      )

      dispatch(
        setVehiclesByPage({
          page,
          vehicles: response?.data?.allVehicles,
          pagination: response?.data?.pagination,
          stats: response?.data?.stats,
          insights:response?.data?.insights
        })
      )

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
  
  const updateVehicleForOrg = async (vehicleId,vehicleDetails) => {  // For super admin only
    try {

      dispatch(setLoading(true))

      const response = await apiConnector(
        "PUT",
        `${vehicleEndpoinsts.UPDATE_VEHICLE}/${vehicleId}`,vehicleDetails
      )

      dispatch(updateVehicle(response?.data?.updatedVehicle))

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
  
  const deleteVehicleForOrg = async (vehicleId,regionId) => {  // For super admin only
    try {

      dispatch(setLoading(true))

      const response = await apiConnector(
        "DELETE",
        `${vehicleEndpoinsts.DELETE_VEHICLE}/${vehicleId}`,{regionId}
      )

      dispatch(deleteVehicle(response?.data?.deletedVehicle))

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }





  return { 
    addVehicle,
    getVehicles,
    updateVehicleForOrg,
    deleteVehicleForOrg
    };
};