import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSubRegionHooks } from "../../hooks/useSubRegionHooks";


const isProduction = useSelector((state)=>state.user.isProduction)
const {getSubRegionsByRegionIds} = useSubRegionHooks()

export const getSubRegionsForRegions = async(regionIds)=>{
    try{
        await getSubRegionsByRegionIds(regionIds)
    }
    catch(error){
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
}