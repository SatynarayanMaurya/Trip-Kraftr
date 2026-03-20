
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { subRegionEndpoints } from '../services/Apis/subRegionApis'
import { addNewSubRegion, deleteSubRegion, setSubRegionsByPage, updateSubRegion } from '../redux/slices/subRegionSlice';

export const useSubRegionHooks = () => {
  const dispatch = useDispatch();
  const subRegionsPages = useSelector((state)=>state.subRegion.subRegionsPages)

  const addSubRegion = async (subRegionDetails) => {  // For Normal Org_admin
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", subRegionEndpoints.ADD_SUB_REGIONS,subRegionDetails)
      dispatch(addNewSubRegion(response?.data?.newSubRegion))
      return response;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  // For getting sub region with paginated
  const getSubRegions = async (page = 1, limit = 5) => {  
    try {
      const cachedPage = subRegionsPages?.[page]

      if (cachedPage) return cachedPage   // 🚀 return cached data

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${subRegionEndpoints.GET_SUB_REGIONS}?page=${page}&limit=${limit}`
      )
      dispatch(
        setSubRegionsByPage({
          page,
          subRegions: response?.data?.allSubRegion,
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

  // For getting sub region by id 
  const getSubRegionById = async (subRegionId) => {  
    try {

      dispatch(setLoading(true))

      const response = await apiConnector(
        "GET",
        `${subRegionEndpoints.GET_SUB_REGIONS_BY_ID}/${subRegionId}`
      )

      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
  // For getting sub region with paginated
  const updateSubRegionById = async (subRegionId,subRegionDetails) => {  
    try {

      dispatch(setLoading(true))
      
      const response = await apiConnector(
        "PUT",
        `${subRegionEndpoints.UPDATE_SUB_REGIONS_BY_ID}/${subRegionId}`,subRegionDetails
      )
      
      dispatch(updateSubRegion(response?.data?.updatedSubRegion))
      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
  // For Delete sub Region by Id
  const deleteSubRegionById = async (subRegionId) => {  
    try {

      dispatch(setLoading(true))
      
      const response = await apiConnector(
        "DELETE",
        `${subRegionEndpoints.DELETE_SUB_REGIONS_BY_ID}/${subRegionId}`,
      )
      
      dispatch(deleteSubRegion(response?.data?.deletedSubRegion?._id))
      return response

    } catch (error) {
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }





  return {
        addSubRegion,
        getSubRegions,
        getSubRegionById,
        updateSubRegionById,
        deleteSubRegionById
    };
};