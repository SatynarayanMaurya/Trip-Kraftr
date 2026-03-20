
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { regionEndpoints, regionEndPointsSuperAdmin } from '../services/Apis/regionApis'
import { addNewMasterRegion, addNewRegion, deleteRegion, setAllRegions, setMasterRegionsByPage } from '../redux/slices/regionSlice'
import { vehicleEndpoinsts } from '../services/Apis/vehicleApis'

export const useVehicleHooks = () => {
  const dispatch = useDispatch();
  const masterRegionsPages = useSelector((state) => state.region.masterRegionsPages)

  const addVehicle = async (vehicleDetails) => {  // For Normal Org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", vehicleEndpoinsts.ADD_VEHICLE, vehicleDetails)
    //   dispatch(addNewRegion(response?.data?.newRegion))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  const getRegionById = async (regionId) => {   // For getting region by id for org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector(
        "GET",
        `${regionEndpoints.GET_REGION_BY_ID}/${regionId}`
      );
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  const getmasterRegions = async (page = 1, limit = 5) => {  // For super admin only
    try {
      const cachedPage = masterRegionsPages?.[page]

      if (cachedPage) return cachedPage   // 🚀 return cached data

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${regionEndPointsSuperAdmin.GET_MASTER_REGION}?page=${page}&limit=${limit}`
      )

      dispatch(
        setMasterRegionsByPage({
          page,
          regions: response?.data?.allMasterRegion,
          pagination: response?.data?.pagination,
          stats: response?.data?.stats
        })
      )

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }





  return { addVehicle,  };
};