
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { regionEndpoints, regionEndPointsSuperAdmin } from '../services/Apis/regionApis'
import { addNewMasterRegion, addNewRegion, deleteRegion, setAllRegions, setMasterRegionsByPage } from '../redux/slices/regionSlice'

export const useRegionHooks = () => {
  const dispatch = useDispatch();
  const masterRegionsPages = useSelector((state) => state.region.masterRegionsPages)

  const addRegion = async (regionDetails) => {  // For Normal Org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", regionEndpoints.ADD_REGION, regionDetails)
      dispatch(addNewRegion(response?.data?.newRegion))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  const addMasterRegion = async (regionDetails) => {  // For super_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", regionEndPointsSuperAdmin.ADD_MASTER_REGION, regionDetails)
      dispatch(addNewMasterRegion(response?.data?.newMasterRegion))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }


  const getRegions = async () => { // For getting all regions only for org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("GET", regionEndpoints.GET_REGIONS)
      dispatch(setAllRegions(response?.data?.regions))
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


  const addRegionImages = async (regionDetails) => {  // For super_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", regionEndPointsSuperAdmin.ADD_REGION_IMAGES, regionDetails, { "Content-Type": "multipart/form-data" })
      // dispatch(addNewMasterRegion(response?.data?.newMasterRegion))
      // console.log("Response : ",response)
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  const fetchRegionImages = async (regionId) => {   // The region id is master region id
    try {
      dispatch(setLoading(true));
      const response = await apiConnector(
        "GET",
        `${regionEndpoints.FETCH_REGIONS_IMAGES}?regionId=${regionId}`
      )
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  const updateRegionById = async (regionId,data) => {   // The region id is region id for table region
    try {
      dispatch(setLoading(true));
      const response = await apiConnector(
        "PUT",
        `${regionEndpoints.UPDATE_REGION_BY_ID}/${regionId}`,data
      )
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  const deleteRegionById = async (regionId) => {   // The region id is region id for table region
    try {
      dispatch(setLoading(true));
      const response = await apiConnector(
        "DELETE",
        `${regionEndpoints.DELETE_REGION_BY_ID}/${regionId}`
      )
      dispatch(deleteRegion(response?.data?.deletedRegion))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }



  return { addRegion, getRegions, addMasterRegion, getmasterRegions, addRegionImages, fetchRegionImages,getRegionById,updateRegionById,deleteRegionById };
};