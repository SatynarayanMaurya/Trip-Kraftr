import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import { useUserHooks } from '../hooks/useUserHooks'
import { useEffect } from 'react'
import { useAuthHooks } from '../hooks/useAuthHooks'

function MainLayout() {

  const userDetails = useSelector((state)=>state.user.userDetails)
  const isProduction = useSelector((state)=>state.user.isProduction)
  const navigate = useNavigate()
  const {getUserDetails} = useUserHooks()
  const {logout} = useAuthHooks()
  const fetchUser = async ()=>{
    try{
      if(userDetails) return ;
      await getUserDetails();
    }
    catch(error){
      toast.error(error?.response?.data?.message || error?.message || "Error in getting the user details")
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      const status = error?.status;
      if (status === 401 || status === 403 ){
        await logout()
        navigate("/auth")
      }
    }
  }

  useEffect(()=>{
    fetchUser()
  },[userDetails])

  return (
    <div className="flex h-screen overflow-hidden">
      
      <div className="w-[16vw] min-h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-[84vw] h-screen overflow-y-auto">
        <Outlet />
      </div>

    </div>
  )
}

export default MainLayout