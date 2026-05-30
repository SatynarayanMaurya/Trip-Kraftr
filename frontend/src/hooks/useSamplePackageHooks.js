
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { samplePackageEndpoints } from '../services/Apis/samplePackageApis';
import { addNewSamplePackage, setSamplePackageByPage } from '../redux/slices/samplePackageSlice';

export const useSamplePackageHooks = () => {
    const dispatch = useDispatch();
    const samplePackagesByPages = useSelector(s=>s.samplePackage.samplePackagesByPages)

    const addSamplePackage = async (samplePackageDetails) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", samplePackageEndpoints.ADD_SAMPLE_PACKAGE, samplePackageDetails)
            if(response?.data?.success){
              dispatch(addNewSamplePackage( response?.data?.newSamplePackage))
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getSamplePackages = async (page = 1, limit = 5) => {
        try {
          const cachedPage = samplePackagesByPages?.[page]
    
          if (cachedPage) return cachedPage   // 🚀 return cached data
    
          dispatch(setLoading(true))
    
          const response = await apiConnector(
            "GET",
            `${samplePackageEndpoints.GET_SAMPLE_PACKAGES}?page=${page}&limit=${limit}`
          )
          dispatch(
            setSamplePackageByPage({
              page,
              samplePackages: response?.data?.allSamplePackages,
              pagination: response?.data?.pagination,
            })
          )
    
          return response
    
        } catch (error) {
          throw error
        } finally {
          dispatch(setLoading(false))
        }
      }




    return {
        addSamplePackage,
        getSamplePackages

    };
};